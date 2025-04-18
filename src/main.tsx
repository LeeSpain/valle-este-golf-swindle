
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main.tsx: Initializing application");

// Add a top-level error handler 
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
  console.error("Error message:", event.message);
  console.error("Error location:", event.filename, "Line:", event.lineno, "Column:", event.colno);
  
  // Prevent the white screen by showing an error in the DOM
  const rootElement = document.getElementById("root");
  if (rootElement && !rootElement.innerHTML) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
        <h2 style="color: #e11d48;">Application Error</h2>
        <p>Sorry, an unexpected error occurred:</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 20px; overflow: auto; max-width: 100%;">${event.message || 'Unknown error'}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 8px 16px; background: #3dd374; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  console.error("Rejection message:", event.reason?.message);
  console.error("Rejection stack:", event.reason?.stack);
});

// Check if our root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found! This is a critical error.");
  
  // Try to show an error message in the body
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
      <h2 style="color: #e11d48;">Critical Error</h2>
      <p>The application could not start because the root element was not found.</p>
      <p>Please try refreshing the page or contact support if the issue persists.</p>
    </div>
  `;
} else {
  console.log("Root element found, mounting React app");
  
  try {
    const root = createRoot(rootElement);
    
    // Add some additional console logs to track rendering progress
    console.log("Root created, about to render React app");
    
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
        <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
          <h2 style="color: #e11d48;">Application Error</h2>
          <p>Sorry, the application failed to load. Please try refreshing the page.</p>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 20px; overflow: auto;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 8px 16px; background: #3dd374; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
}
