import React, { createContext, useState, useEffect, useMemo } from 'react';
import { loadUISettings, saveUISettings } from '../utils/localStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const UISettingsContext = createContext();

export const UISettingsProvider = ({ children }) => {
  const [uiSettings, setUiSettings] = useState(loadUISettings());

  useEffect(() => {
    saveUISettings(uiSettings);
  }, [uiSettings]);

  const value = useMemo(() => ({
    uiSettings,
    setUiSettings,
  }), [uiSettings]);

  return (
    <UISettingsContext.Provider value={value}>
      {children}
    </UISettingsContext.Provider>
  );
};
