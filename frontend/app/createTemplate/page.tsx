"use client";
import React, { useState } from "react";

interface VariableType {
  [key: string]: string | number;
}

function CreateTemplate() {
  const [template, setTemplate] = useState<string>("");
  const [templateVariables, setTemplateVariables] = useState<VariableType>({});

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplate(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const ans: VariableType = findWordsInBraces(template);
    if (Object.keys(ans).length == 0) {
      alert("No identifiers found.");
      return;
    }
  };

  function findWordsInBraces(paragraph: string): VariableType {
    // Regular expression to match words between curly braces
    const regex = /{([^{}]+)}/g;

    // Set to store unique words found between curly braces
    const uniqueWordsInBraces: Set<string> = new Set();
    let variableObject: { [key: string]: string } = {};

    let match;
    while ((match = regex.exec(paragraph)) !== null) {
      // Extract the word
      const word = match[1];

      variableObject[word] = "";
    }
    setTemplateVariables(variableObject);

    return variableObject;
  }

  const handleVariableChange = (key: string, value: string | number) => {
    setTemplateVariables((prevTemplateVariables) => ({
      ...prevTemplateVariables,
      [key]: value,
    }));
  };

  const handleReplaceVariables = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let ans = template;
    for(const i in templateVariables){
      console.log(i, "\n")
      const regex = new RegExp(`\\{${i}\\}`, 'g');
      ans = ans.replace(regex, templateVariables[i].toString());
    }
    console.log(">>>", ans);
  }

  return (
    <div className="flex bg-green-600 p-5 flex-col">
      <div className=" w-full flex p-2">
        <textarea
          className=" border-none focus:border-none w-full p-2 flex items-center"
          value={template}
          onChange={handleChange}
          placeholder="Type Your Template Here"
        />
        <button onClick={(e) => handleSubmit(e)}>Submit Template</button>
      </div>
      {Object.keys(templateVariables).length > 0 ? (
        <>
          <div className="w-full flex p-2">
            {Object.keys(templateVariables).map((singleVariable) => {
              return (
                <div key={singleVariable} className="">
                  <label>{singleVariable}</label>
                  <input
                    name={singleVariable}
                    type="text"
                    value={templateVariables[singleVariable]}
                    onChange={(e) =>
                      handleVariableChange(e.target.name, e.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>

          <button className="border border-yellow-400 p-2" onClick={handleReplaceVariables}>Replace All Variables</button>
        </>
      ) : null}
    </div>
  );
}

export default CreateTemplate;
