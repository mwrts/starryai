import React, { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const themes = {
  dark: {
    '--main-bg-color': '#282c34',
    '--text-color': 'white',
    '--accent-color': '#4f46e5',
    '--accent-color-rgb': '79, 70, 229',
    '--secondary-bg-color': '#1a1a1a',
    '--border-color': '#444',
  },
  light: {
    '--main-bg-color': '#ffffff',
    '--text-color': '#000000',
    '--accent-color': '#4f46e5',
    '--accent-color-rgb': '79, 70, 229',
    '--secondary-bg-color': '#f8f9fa',
    '--border-color': '#dee2e6',
  },
  "solarized-dark": {
    '--main-bg-color': '#002b36',
    '--text-color': '#ffffff',
    '--accent-color': '#268bd2',
    '--accent-color-rgb': '38, 139, 210',
    '--secondary-bg-color': '#073642',
    '--border-color': '#586e75',
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : themes.dark;
  });

  useEffect(() => {
    for (const key in theme) {
      document.documentElement.style.setProperty(key, theme[key]);
    }
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
