import React, { memo, useMemo } from "react";
import MemoizedReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm"; 
import rehypeRaw from "rehype-raw"; 


interface FormattedResponseProps {
  content: string;
}

const InlineCode = memo(({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <code className={`${className} bg-gray-200 text-red-500 px-1.5 py-0.5 rounded`}>
      {children}
    </code>
  );
});
InlineCode.displayName = "InlineCode";


const FormattedResponse: React.FC<FormattedResponseProps> = ({ content }) => {
  const memoizedContent = useMemo(() => content, [content]);
  const components: import("react-markdown").Components = useMemo(() => ({
    code(props: { className?: string; children?: React.ReactNode }) {
      const {children, className, ...rest} = props
      const match = /language-(\w+)/.exec(className || '');
      return  match ? (
        <div className="my-4">
        <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded-t-lg">
          <span className="text-sm text-white">{match[1]}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
            }}
            className="text-xs bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 text-white py-1 px-2 rounded"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
            {...rest}
            PreTag="div"
            language={match[1]}
            style={atomDark}
          >
            {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
           </div>
        ) : (
          <InlineCode className={className} {...props}>
          {children}
        </InlineCode>
      );
    },
  }), []);

  return (
    <div className="w-full p-4 rounded-2xl shadow-md prose prose-lg max-w-none">
      <MemoizedReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {memoizedContent}
      </MemoizedReactMarkdown>
    </div>
  );
};
export default FormattedResponse;
