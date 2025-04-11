import React, { useCallback, useEffect, useState } from 'react';
import { Send, } from 'lucide-react';
import { ChatMessage, Message } from '../models/chat';

import FormattedResponse from './AIResponseFormatter';
import { useStateContext } from '../context/FilterContextProvider';
import UploadButton from './UploadButton';
import FileToTextConverter from './FileToTextConverter';
import { Orchestrator } from '../lib/orchestrator';
import { openrouter } from '../lib/openroute';



type ChatProps = {
    model: string
    onChange?: (selected: string) => void
    onClickRessponse?: (res: string) => void
    input?: string
};

const AIChatComponent: React.FC<ChatProps> = ({ 
    model, 
    onChange,
    onClickRessponse,
    input, 

  }) =>{

  const [inputMessage, setInputMessage] = useState('');
  const [inputFile, setInputFile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { linkInp, triggerAll, triggered, mergeResponse, models, messages, setMessages } = useStateContext()
   useEffect(() => {
    setInputMessage(input || '')
   },[input])
   useEffect(() => {
    if (triggered && linkInp) {
        handleSendMessage()
    }
  }, [triggered]);

  const handleSendMessage = async () => {
    triggerAll();
    if (!inputMessage.trim()) return;
    onClickRessponse?.(inputMessage)
    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, { role: 'user', content: inputMessage } as ChatMessage]);
    if(inputFile !="")
      userMessage.content += ` FILE: ${inputFile}`
    const msn = [...messages, userMessage]
    setInputMessage('');
    setIsLoading(true);
    const options = {
        //model: model,
        messages: msn,
        model: model
    }
    
    try {
      if(mergeResponse){
        const orchestrator = new Orchestrator(models.map(m => m.value))
        await orchestrator.processRequest(inputMessage, updateLastMessage)
       
      } else {
        await openrouter.fetchWithRetry(options, updateLastMessage);
      }
    } catch (error) {
      console.error("Error during message processing:", error);
      // Handle error appropriately here
    } finally {
      setIsLoading(false);
    }
  };

  const updateLastMessage = useCallback((content: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setMessages((prevMessages: any) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage?.role === 'assistant') {
        return [
          ...prevMessages.slice(0, -1),
          { role: 'assistant', content: content } as ChatMessage
        ];
      } else {
        return [...prevMessages, { role: 'assistant', content: content } as ChatMessage];
      }
    });
  }, []);

    function handleInput(value: string): void {
       setInputMessage(value)
       if(linkInp)
       onChange?.(value)
    }
    const textExtracted = (text: string) =>{
      setInputFile(text)
      //console.log(text)
    }

  return (
    <div className="flex flex-col w-full bg-orange-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    {/* Chat Messages Container */}
    <div className="flex-grow flex flex-col items-stretch overflow-y-auto p-4 space-y-4">
      {messages.map((msg, i) => (
        <div 
          key={i} 
          className={`max-w-[80%] p-3 rounded-lg ${
            msg.role === 'user' 
              ? `w-fit max-w-1/2 self-end bg-orange-200 dark:bg-gray-700 dark:text-gray-100` 
              : `self-start bg-orange-100 dark:bg-gray-800 dark:text-gray-100`
          }`}
        >
          {msg.role === 'assistant' ? <FormattedResponse content={msg.content} />:msg.content}
          
        </div>
      ))}
      
      {/* Loading indicator for when a response is being generated */}
      {isLoading && (
        <div className="self-start bg-orange-100 dark:bg-gray-800 max-w-[80%] p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-orange-400 dark:bg-blue-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-orange-400 dark:bg-blue-400 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-orange-400 dark:bg-blue-400 animate-pulse delay-300"></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
          </div>
        </div>
      )}
    </div>

    {/* Message Input */}
    <div className="p-4 flex items-center space-x-2">
      <textarea      
        value={inputMessage}
        onChange={(e) => handleInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-grow p-2 rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-gray-100 
          border border-gray-300 dark:border-gray-600 
          focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500
          disabled:opacity-70 disabled:cursor-not-allowed"
      /> 
      <UploadButton disabled={isLoading}>
        <FileToTextConverter onTextExtracted={textExtracted} />
      </UploadButton>
      <button 
        onClick={handleSendMessage}
        disabled={isLoading}
        className="p-2 rounded-full 
          bg-orange-200 dark:bg-gray-700 
          hover:bg-orange-300 dark:hover:bg-gray-600 
          transition-all
          disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Send className="w-6 h-6" />
      </button>
    </div>
  </div>
  );
};

export default AIChatComponent;