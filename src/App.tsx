import { useState } from 'react';
import './App.css'

export type ColorTheme = '' | 'light' | 'dark';

function loadColorTheme(): ColorTheme {
  const value = localStorage.getItem('color-theme');
  if (value == null) {
    return '';
  } else if (value == '' || value == 'light' || value == 'dark') {
    return value;
  }
  console.error('Invalid color theme! ' + value);
  return '';
}

const firstColorTheme = loadColorTheme();

function App() {
  const [theme, setTheme] = useState(firstColorTheme);

  // XXX: This is hacky. Replace a toggle control or something.
  (window as any).setTheme = function(theme: ColorTheme) {
    localStorage.setItem('color-theme', theme);
    setTheme(theme);
  }

  const themeClassName = theme || '';

  return (
    <div className={themeClassName + " h-screen w-screen background-component"}>
      <svg className="h-screen w-screen">
        <line x1="75%" y1="0" x2="75%" y2="100%" style={{
          stroke: 'var(--pakrypt-stripe-color)',
          strokeWidth: 20, // I want CM or something.
        }}></line>
      </svg>
    </div>
  )
}

export default App
