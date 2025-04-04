
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main.tsx: Initializing application");

// Add global error handler with more details
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
  console.error("Error message:", event.error?.message);
  console.error("Error stack:", event.error?.stack);
});

// Add unhandled promise rejection handler with more details
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  console.error("Rejection message:", event.reason?.message);
  console.error("Rejection stack:", event.reason?.stack);
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
    
    console.log("React app mounted successfully");
  } catch (error) {
    console.error("Failed to render React app:", error);
    // Add emergency fallback rendering
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>Sorry, the application failed to load. Please try refreshing the page.</p>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 20px;">${error?.message || 'Unknown error'}</pre>
        </div>
      `;
    }
  }
}
