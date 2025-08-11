import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './forms.css';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProxyProvider } from './contexts/ProxyContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProxyProvider>
        <App />
      </ProxyProvider>
    </ThemeProvider>
  </StrictMode>,
);
