import React, { createContext, useState, useEffect, useMemo } from 'react';
import { loadActiveProxyId, saveActiveProxyId, loadProxyConfigs } from '../utils/localStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const ProxyContext = createContext();

export const ProxyProvider = ({ children }) => {
  const [activeProxyId, setActiveProxyId] = useState(loadActiveProxyId());
  const [proxyConfigs, setProxyConfigs] = useState(loadProxyConfigs());

  useEffect(() => {
    saveActiveProxyId(activeProxyId);
  }, [activeProxyId]);

  const refreshProxyConfigs = () => {
    setProxyConfigs(loadProxyConfigs());
    setActiveProxyId(loadActiveProxyId());
  };

  const activeProxy = useMemo(() => {
    return activeProxyId
      ? proxyConfigs.find(c => c.id.toString() === activeProxyId)
      : proxyConfigs[0];
  }, [activeProxyId, proxyConfigs]);

  const value = useMemo(() => ({
    proxyConfigs,
    activeProxyId,
    setActiveProxyId,
    activeProxy,
    refreshProxyConfigs
  }), [proxyConfigs, activeProxyId, activeProxy]);

  return (
    <ProxyContext.Provider value={value}>
      {children}
    </ProxyContext.Provider>
  );
};
