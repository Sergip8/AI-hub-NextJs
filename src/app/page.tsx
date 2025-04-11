'use client'

import { useEffect, useState } from "react";
import AIChatComponent from "./components/Chat";
import { MultiSelect } from "./components/Select";
import StyleMode from "./components/StyleMode";
import { openrouter } from "./lib/openroute";
import {  useStateContext} from "./context/FilterContextProvider";
import {Option} from "./models/select"
import 'prismjs/themes/prism-tomorrow.css'; 

export default function Home() {

  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatModels, setChatModels] = useState<Option[]>([]);
  const {linkInp, updateSetlinkInp,  mergeResponse, models, setModels, setMergeResponse} = useStateContext()
  useEffect(() => {
    openrouter.getModels().then(d => {
      console.log(d.data)
      setSelectedItems(d.data.filter((m: { pricing: { completion: string; }; }) => m.pricing.completion == "0").map((m: { id: string; name: string }) => Object.assign({value: m.id, label: m.name})))

    })
    console.log(process.env)
  },[])
  useEffect(() => {
    
    if(mergeResponse){
      if(models.length > 0){
        setChatModels([models[0]])
        return
      }
    }
    setChatModels(models)
  }, [mergeResponse, models])

  const handleChange = (e: { target: { checked: boolean; }; }) => {
    console.log(e.target.checked)
    updateSetlinkInp(e.target.checked);
  };

  return (
    <div className="min-h-screen p-8 bg-[#FFF7F0] dark:bg-[#0A1128] text-[#4B3F35] dark:text-[#A3B4D8] transition-colors duration-300">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-[#A35400] dark:text-[#A3B4D8]">AI Framework Selector</h1>
      <StyleMode />
    </div>

    {/* MultiSelect and Checkbox */}
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <MultiSelect
        options={selectedItems}
        onChange={setModels}
        placeholder="Choose frameworks"
        maxSelected={3}
      />
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input 
          type="checkbox" 
          checked={linkInp} 
          onChange={handleChange} 
          className="form-checkbox h-5 w-5 text-[#A35400] dark:text-[#0A1128] bg-[#FFF7F0] dark:bg-[#1C2D4D] border-[#A35400] dark:border-[#1C2D4D] rounded focus:ring-0"
        />
        Enable Link Input
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input 
          type="checkbox" 
          checked={mergeResponse} 
          onChange={(e) => setMergeResponse(e.target.checked)} 
          className="form-checkbox h-5 w-5 text-[#A35400] dark:text-[#0A1128] bg-[#FFF7F0] dark:bg-[#1C2D4D] border-[#A35400] dark:border-[#1C2D4D] rounded focus:ring-0"
        />
        Get Merged Response
      </label>
    </div>

    {/* Chat Components */}
    <section className="flex  gap-3 w-full">
      {chatModels.map(m => (
        <div 
          key={m.value} 
          className="p-4 rounded-xl w-full shadow-md bg-[#FFEBD6] dark:bg-[#1C2D4D] border border-[#A35400] dark:border-[#1C2D4D] transition-colors duration-300"
        >
          <AIChatComponent 
            input={inputMessage} 
            onChange={setInputMessage} 
            
            model={m.value} 
          />
        </div>
      ))}
    </section>
  
  </div>
  );
}
