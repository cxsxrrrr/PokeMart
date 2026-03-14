import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import './index.css';
import App from './App';

import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './providers/ToastProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <HeroUIProvider>
            <main className="text-foreground bg-background min-h-screen">
              <App />
            </main>
          </HeroUIProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
