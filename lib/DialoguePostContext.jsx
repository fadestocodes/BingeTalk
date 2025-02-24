import React, { createContext, useState, useContext } from 'react';

const DialogueContext = createContext();

export const useDialogueContext = () => useContext(DialogueContext);

export const DialogueProvider = ({ children }) => {
  const [dialogue, setDialogue] = useState(null);

  const updateDialogue = (dialogueData) => {
    setDialogue(dialogueData);
  };

  return (
    <DialogueContext.Provider value={{ dialogue, updateDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};
