import React, { createContext, useState } from 'react';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzedContent, setAnalyzedContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <NewsContext.Provider value={{
      analysisResult,
      setAnalysisResult,
      analyzedContent,
      setAnalyzedContent,
      isAnalyzing,
      setIsAnalyzing
    }}>
      {children}
    </NewsContext.Provider>
  );
};
