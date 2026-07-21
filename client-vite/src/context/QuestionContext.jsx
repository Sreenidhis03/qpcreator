// src/context/QuestionContext.jsx
import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [allModuleQuestions, setAllModuleQuestions] = useState({});
  const [metaInfo, setMetaInfo] = useState({ program: "", semester: "", subject: "" });

  const addModuleQuestions = (moduleNum, questions) => {
    setAllModuleQuestions(prev => ({
      ...prev,
      [moduleNum]: questions
    }));
  };

  return (
    <QuestionContext.Provider value={{
      allModuleQuestions, addModuleQuestions, metaInfo, setMetaInfo
    }}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionContext);
}
