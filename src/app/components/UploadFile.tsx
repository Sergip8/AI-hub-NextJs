import React, { useState } from 'react';
import FileToTextConverter from './FileToTextConverter';

const FileUpload: React.FC = () => {
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleTextExtracted = (text: string, name: string) => {
    setExtractedText(text);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Convertidor de Archivos a Texto</h1>
          <p className="text-gray-600">Sube documentos y extrae su contenido como texto</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <FileToTextConverter 
            onTextExtracted={handleTextExtracted}
            maxFileSize={10 * 1024 * 1024} // 10MB
          />
        </div>
        
        {extractedText && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Contenido de {fileName}:</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                  // Aquí puedes añadir un toast de notificación
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Copiar Texto
              </button>
            </div>
            <div className="relative">
              <textarea
                value={extractedText}
                readOnly
                className="w-full h-96 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                placeholder="El contenido del archivo aparecerá aquí..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {extractedText.length} caracteres
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;