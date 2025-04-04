
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main.tsx: Initializing application");

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  console.log("Root element found, mounting React app");
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("React app mounted");
  } catch (error) {
    console.error("Failed to render React app:", error);
  }
}
