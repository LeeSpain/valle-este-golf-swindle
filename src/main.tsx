
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main.tsx: Initializing application");

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
  
  // Add detailed global error handlers
  window.addEventListener('error', (event) => {
    console.error("Global error caught:", event.error);
    console.error("Error message:", event.error?.message);
    console.error("Error stack:", event.error?.stack);
    console.error("Error location:", event.filename, "Line:", event.lineno, "Column:", event.colno);
    
    // Don't try to recover automatically from certain errors
    if (event.error?.message?.includes("hydration") || 
        event.error?.message?.includes("Minified React error")) {
      console.warn("Critical React error detected - page may need to be refreshed");
    }
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    console.error("Rejection message:", event.reason?.message);
    console.error("Rejection stack:", event.reason?.stack);
  });
  
  try {
    const root = createRoot(rootElement);
    
    // Add some additional console logs to track rendering progress
    console.log("Root created, about to render React app");
    
    root.render(
      <React.StrictMode>
        <React.Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #3dd374',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <p style={{marginTop: '20px'}}>Loading application...</p>
            </div>
          </div>
        }>
          <App />
        </React.Suspense>
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
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 20px; overflow: auto;">${error?.message || 'Unknown error'}</pre>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 8px 16px; background: #3dd374; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
}
