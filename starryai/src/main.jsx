import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './forms.css';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProxyProvider } from './contexts/ProxyContext';
import { UISettingsProvider } from './contexts/UISettingsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProxyProvider>
        <UISettingsProvider>
          <App />
        </UISettingsProvider>
      </ProxyProvider>
    </ThemeProvider>
  </StrictMode>,
);
