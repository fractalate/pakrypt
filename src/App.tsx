import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { NewPak1r0, Pak } from './pak/Pak'
import { ThemeContext } from './Contexts'
import { addThemeSwitchListener, getAppliedTheme, removeThemeSwitchListener } from './lib/theme'
import Pages from './pages/Pages'
import PakContextProvider from './pak/PakContextProvider'

function ThemeContextProvider({ children }: PropsWithChildren) {
  const initialTheme = useMemo(() => getAppliedTheme(), []);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  
  useEffect(() => {
    const listener = () => {
      setCurrentTheme(getAppliedTheme());
    };
    addThemeSwitchListener(listener);
    return () => {
      removeThemeSwitchListener(listener);
    };
  }, []);

  return <ThemeContext.Provider value={currentTheme}>
    {children}
  </ThemeContext.Provider>
}

export default function App() {
  return <ThemeContextProvider>
    <PakContextProvider>
      <Pages />
    </PakContextProvider>
  </ThemeContextProvider>
}
