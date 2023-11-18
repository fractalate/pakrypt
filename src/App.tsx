import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { NewPak1r0, Pak } from './lib/pak'
import { PakContext, ThemeContext } from './Contexts'
import { addThemeSwitchListener, getAppliedTheme, removeThemeSwitchListener } from './lib/theme'
import Pages from './pages/Pages'

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

function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => NewPak1r0(), [])
  const [pak, _setPak] = useState(initialPak as Pak)

  return <PakContext.Provider value={pak}>
    {children}
  </PakContext.Provider>
}

export default function App() {
  return <ThemeContextProvider>
    <PakContextProvider>
      <Pages />
    </PakContextProvider>
  </ThemeContextProvider>
}
