import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingModeContext = createContext(null);

export const ReadingModeProvider = ({ children }) => {
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('unfiltered_font') || 'serif'; // 'serif' | 'sans'
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('unfiltered_font_size') || 'medium'; // 'small' | 'medium' | 'large'
  });

  useEffect(() => {
    localStorage.setItem('unfiltered_font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('unfiltered_font_size', fontSize);
  }, [fontSize]);

  const toggleFontFamily = () => {
    setFontFamily(prev => (prev === 'serif' ? 'sans' : 'serif'));
  };

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'small';
    });
  };

  return (
    <ReadingModeContext.Provider
      value={{
        fontFamily,
        setFontFamily,
        toggleFontFamily,
        fontSize,
        setFontSize,
        cycleFontSize
      }}
    >
      {children}
    </ReadingModeContext.Provider>
  );
};

export const useReadingMode = () => {
  const context = useContext(ReadingModeContext);
  if (!context) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider');
  }
  return context;
};
