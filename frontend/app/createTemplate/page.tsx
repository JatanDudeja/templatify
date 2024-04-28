'use client';
import React, { useState } from 'react'

function CreateTemplate() {
    const [template, setTemplate] = useState<string>("");

    const handleChange = (e) => {
        setTemplate(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const ans = findWordsInBraces(template);
        if(ans.length != 0){
            console.log(ans);
        }
        else{
            alert("Don't use same identifiers!!")
        }
    }

    function findWordsInBraces(paragraph: string) {
        // Regular expression to match words between curly braces
        const regex = /{([^{}]+)}/g;
        
        // Set to store unique words found between curly braces
        const uniqueWordsInBraces = new Set();

        let match;
        while ((match = regex.exec(paragraph)) !== null) {
            // Extract the word
            const word = match[1];
            
            // Check if the word is already in the set
            if (uniqueWordsInBraces.has(word)) {
                // If the word is repeated, add it to the repeatedWords array
                console.log("Repeated words found:", word);
                return [];
            } else {
                // If the word is unique, add it to the set
                uniqueWordsInBraces.add(word);
            }
        }

        return Array.from(uniqueWordsInBraces);
    }


  return (
    <div className='flex bg-green-600 p-5'>
        <textarea className=' border-none focus:border-none w-full p-2 flex items-center' value={template} onChange={handleChange} placeholder='Type Your Template Here'/>
        <button onClick={e => handleSubmit(e)}>
            Submit Template
        </button>

    </div>
  )
}

export default CreateTemplate