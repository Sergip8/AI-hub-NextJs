'use client'
import {  ReactNode, createContext, useContext, useState } from "react";
import {Option} from "../models/select"
import { ChatMessage } from "../models/chat";

type ContextType = {
    models: Option[],
    linkInp: boolean,
    mergeResponse: boolean,
    messages: ChatMessage[],
    setMessages: (value: ChatMessage[]) => void,
    inputResponse: string,
    triggerAll: () => void;
  triggered: boolean;
    setModels: (value:Option[]) => void,
    setInputResponse: (value:string) => void,
    setlinkInp: (value:boolean) => void,
    setMergeResponse: (value:boolean) => void,
   
   
  
    updateSetlinkInp: (value: boolean) => void,
}
const contextDefault: ContextType = {
    models: [],
    linkInp: true,
    messages: [],
    setMessages: () => {},
    mergeResponse: false,
    inputResponse: "",
    triggered: false,
    setModels: () => {},
    triggerAll: () => {},
    setInputResponse: () => {},
    setlinkInp: () => {},
    updateSetlinkInp: () => {},
    setMergeResponse: () => {},
  

}
const StateContext = createContext<ContextType>(contextDefault)

export const ContextProvider = ({children}:{children:ReactNode}) => {
    const [triggered, setTriggered] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{role: "system", content:"hola"}]);
    const [linkInp, setlinkInp] = useState(true);
    const [mergeResponse, setMergeResponse] = useState(false);
    const [inputResponse, setInputResponse] = useState('')
    const [models, setModels] = useState<Option[]>([]);
    const updateSetlinkInp = (value: boolean) =>{
        setlinkInp(value)
    }

    const triggerAll = () => {
        setTriggered(true);
        setTimeout(() => setTriggered(false), 50); // Resetea el estado después de un corto tiempo
      };
    return(
        <>
        <StateContext.Provider value={{
            inputResponse,
            linkInp,
            mergeResponse,
          models,
          messages,
            setMessages,
          updateSetlinkInp,
          setModels,
          triggerAll, 
          setInputResponse,
          setlinkInp,
          setMergeResponse,
          triggered
        }}>
            {children}

        </StateContext.Provider>
        </>
    )
}
export function useStateContext() {
    return useContext(StateContext)
}

//export const filterStateContext = () => useContext(FilterContext)

