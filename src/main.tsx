import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { startupTheme } from './lib/theme.ts'
import { DemoFunction } from './lib/krypt.ts'

startupTheme()

DemoFunction()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
