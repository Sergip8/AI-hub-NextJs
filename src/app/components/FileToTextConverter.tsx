import React, {  useCallback } from 'react';

import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { parse } from 'papaparse';
import { File} from 'lucide-react';

interface FileToTextConverterProps {
  onTextExtracted: (text: string, fileName: string) => void;
  maxFileSize?: number; // en bytes
  allowedFileTypes?: string[];
}

// const defaultAllowedTypes = [
//   'text/plain',
//   'application/pdf',
//   'application/msword',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   'application/vnd.ms-excel',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   'text/csv',
//   'application/sql',
//   'application/x-sql'
// ];

const FileToTextConverter: React.FC<FileToTextConverterProps> = ({
  onTextExtracted,
 
}) => {


  const processFile = useCallback(async (file: File) => {
  
    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
       // extractedText = await extractTextFromPdf(file);
      } else if (file.type.includes('msword') || file.type.includes('wordprocessingml')) {
        extractedText = await extractTextFromDocx(file);
      } else if (file.type.includes('excel') || file.type.includes('spreadsheetml')) {
        extractedText = await extractTextFromExcel(file);
      } else if (file.type === 'text/csv') {
        extractedText = await extractTextFromCsv(file);
      } else {
        extractedText = await extractTextFromPlainFile(file);
      }

      onTextExtracted(extractedText, file.name);
    } catch (err) {
      console.error('Error processing file:', err);
     
    } finally {
        
    }
  }, [onTextExtracted]);

  

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromExcel = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    let text = '';
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      text += `=== ${sheetName} ===\n`;
      text += XLSX.utils.sheet_to_csv(worksheet) + '\n\n';
    });
    
    return text.trim();
  };

  const extractTextFromCsv = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error('No se pudo leer el archivo CSV'));
            return;
          }
    
          // Primero intentamos con UTF-8
          const content = event.target.result as string;
          
          parse(content, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              if (results.errors.length > 0) {
                console.warn('Errores al parsear CSV:', results.errors);
              }
    
              let text = '';
              if (results.data && Array.isArray(results.data)) {
                text = results.data.map(row => 
                  Object.values(row as Record<string, unknown>).join('\t')
                ).join('\n');
              }
    
              // Verificar si hay caracteres corruptos (�)
              if (text.includes('\ufffd')) {
                // Si hay caracteres corruptos, intentar con ISO-8859-1
                const latin1Reader = new FileReader();
                latin1Reader.onload = (e) => {
                  if (!e.target?.result) {
                    resolve(text); // Devolver el texto aunque tenga errores
                    return;
                  }
                  
                  const latin1Content = new TextDecoder('ISO-8859-1')
                    .decode(e.target.result as ArrayBuffer);
                  
                  parse(latin1Content, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (latin1Results) => {
                      let latin1Text = '';
                      if (latin1Results.data && Array.isArray(latin1Results.data)) {
                        latin1Text = latin1Results.data.map(row => 
                          Object.values(row as Record<string, unknown>).join('\t')
                        ).join('\n');
                      }
                      resolve(latin1Text);
                    },
                    error: () => {
                      resolve(text); // Devolver el texto original si falla
                    }
                  });
                };
                latin1Reader.readAsArrayBuffer(file);
              } else {
                resolve(text);
              }
            },
            error: (error: Error) => {
              reject(error);
            }
          });
        };
    
        reader.onerror = () => reject(new Error('Error al leer el archivo CSV'));
        reader.readAsText(file, 'UTF-8');
      });
  };

  const extractTextFromPlainFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('No se pudo leer el archivo'));
          return;
        }
        resolve(event.target.result as string);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  };

  return (
    <div className="    rounded-lg">
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={(e) => {
          const files = e.target?.files;
          if (files && files[0]) {
            processFile(files[0]);
          }
        }}
      />
      <label 
        htmlFor="file-input"
        className="flex gap-1 hover:text-amber-500 px-4 py-2  rounded-md cursor-pointer transition"
      >
         <File className="w-6 h-6" />
         <span>
       select file

         </span>
      </label>

   
    </div>
  );
};

export default FileToTextConverter;