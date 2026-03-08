import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import './index.css';
import App from './App';

import { AuthProvider } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <HeroUIProvider>
          <main className="text-foreground bg-background min-h-screen">
            <App />
          </main>
        </HeroUIProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
