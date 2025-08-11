import React, { createContext, useState, useEffect } from 'react';
import { loadActiveProxyId, saveActiveProxyId, loadProxyConfigs } from '../utils/localStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const ProxyContext = createContext();

export const ProxyProvider = ({ children }) => {
  const [activeProxyId, setActiveProxyId] = useState(loadActiveProxyId());
  const [proxyConfigs, setProxyConfigs] = useState(loadProxyConfigs());

  useEffect(() => {
    saveActiveProxyId(activeProxyId);
  }, [activeProxyId]);

  // Function to refresh configs from storage, useful after changes on settings page
  const refreshProxyConfigs = () => {
    setProxyConfigs(loadProxyConfigs());
    setActiveProxyId(loadActiveProxyId());
  };

  const activeProxy = activeProxyId
    ? proxyConfigs.find(c => c.id.toString() === activeProxyId)
    : proxyConfigs[0];

  return (
    <ProxyContext.Provider value={{
      proxyConfigs,
      activeProxyId,
      setActiveProxyId,
      activeProxy,
      refreshProxyConfigs
    }}>
      {children}
    </ProxyContext.Provider>
  );
};
