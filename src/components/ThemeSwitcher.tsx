import { useEffect, useMemo, useState } from "react";
import { Theme, addThemeSwitchListener, clearGlobalTheme, getAppliedTheme, removeThemeSwitchListener, setGlobalTheme } from "../lib/theme";

function computeThemeText(theme: Theme): string {
  return theme;
}

export default function ThemeSwitcher() {
  const initialTheme = useMemo(() => getAppliedTheme(), []);
  
  const [themeText, setThemeText] = useState(computeThemeText(initialTheme));
  
  function setTheme(theme: Theme) {
    setGlobalTheme(theme);
    setThemeText(computeThemeText(theme));
  }

  function clearTheme() {
    clearGlobalTheme();
    setThemeText(computeThemeText(getAppliedTheme()));
  }

  useEffect(() => {
    const listener = () => {
      setThemeText(computeThemeText(getAppliedTheme()));
    };
    addThemeSwitchListener(listener);
    return () => {
      removeThemeSwitchListener(listener);
    };
  }, []);

  return (
    <div className={`
      h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
    `}>
      Theme is {themeText}
      <br/>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => clearTheme()}>Set No Theme</button>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => setTheme('light')}>Set Light Theme</button>
    </div>
  )
}
