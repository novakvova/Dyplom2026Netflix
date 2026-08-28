import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ReactQueryProvider>
          <AuthProvider>
              <BrowserRouter>
                  <App/>
              </BrowserRouter>
          </AuthProvider>
      </ReactQueryProvider>
  </StrictMode>,
)
