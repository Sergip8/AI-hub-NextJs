import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { refractor } from 'refractor';


interface FormatOptions {
  detectLanguage?: boolean;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Detecta si el texto contiene bloques de código markdown
 */
export function containsCodeBlocks(text: string): boolean {
  return /```[\s\S]+?```/g.test(text);
}

/**
 * Extrae el lenguaje de un bloque de código markdown
 */
export function detectCodeLanguage(text: string): string | null {
  const match = text.match(/```(\w+)/);
  return match ? match[1] : null;
}

/**
 * Formatea una respuesta de la IA que puede contener markdown y código
 */
export function formatAIResponse(text: string, options: FormatOptions = {}): string {
  if (!containsCodeBlocks(text)) {
    return text; // No requiere formateo especial
  }

  // Procesar bloques de código en el texto
  return text.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, language, code) => {
    // Si se debe detectar el lenguaje y no está especificado
    if (options.detectLanguage && !language) {
      // Intentar detectar por el contenido (simplificado)
      const lang = detectFromContent(code);
      language = lang || 'text';
    }
    
    // Aplicar tema
    const themeClass = options.theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    // Agregar números de línea si está habilitado
    let formattedCode = code;
    if (options.showLineNumbers) {
      formattedCode = addLineNumbers(code);
    }
    
    // Retornar el bloque formateado con clases adicionales
    return `<pre class="code-block ${themeClass}${language ? ` language-${language}` : ''}">
<code>${formattedCode}</code>
</pre>`;
  });
}

/**
 * Intenta detectar el lenguaje basado en el contenido del código
 * (Versión simplificada, se podría mejorar)
 */
function detectFromContent(code: string): string | null {
  // Detección básica por patrones comunes
  if (code.includes('function') && code.includes(';')) {
    return 'javascript';
  }
  if (code.includes('def ') && code.includes(':')) {
    return 'python';
  }
  if (code.includes('<div') || code.includes('</')) {
    return 'html';
  }
  if (code.includes('import ') && code.includes('from ') && !code.includes(';')) {
    return 'python';
  }
  return null;
}

/**
 * Agrega números de línea al código
 */
function addLineNumbers(code: string): string {
  const lines = code.split('\n');
  return lines.map((line, index) => 
    `<span class="line-number">${index + 1}</span>${line}`
  ).join('\n');
}

/**
 * Plugin para resaltar código en react-markdown
 */
export const codeHighlightPlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'code', (node) => {
    const lang = node.lang || 'text';
    let highlightedCode;

    try {
      if (lang && lang !== 'text' && refractor.registered(lang)) {
        highlightedCode = refractor.highlight(node.value, lang);
      }
    } catch (error) {
      console.error('Error highlighting code:', error);
    }

    node.data = {
      ...(node.data || {}),
      hChildren: Array.isArray(highlightedCode) ? highlightedCode : undefined,
      hProperties: {
        className: [`language-${lang}`]
      }
    };
  });
};

/**
 * Componente para renderizar código con resaltado de sintaxis
 */
export function CodeBlock({ language, value, showLineNumbers = false, theme = 'light' }: { 
  language: string; 
  value: string;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
}) {
  const formattedValue = showLineNumbers ? addLineNumbers(value) : value;
  const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
  
  return (
    <pre className={`code-block ${themeClass} language-${language}`}>
      <code className={`language-${language}`} 
           dangerouslySetInnerHTML={{ __html: formattedValue }} />
    </pre>
  );
}