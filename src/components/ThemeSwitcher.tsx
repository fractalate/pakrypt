import { useContext } from "react";
import { Theme, clearPreferredTheme, setPreferredTheme } from "../lib/theme";
import { ThemeContext } from "../Contexts";

function computeThemeText(theme: Theme): string {
  return theme;
}

export default function ThemeSwitcher() {
  const themeText = computeThemeText(useContext(ThemeContext));

  return (
    <div className={`
      h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
    `}>
      Theme is {themeText}
      <br/>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => clearPreferredTheme()}>Set No Theme</button>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => setPreferredTheme('dark')}>Set Dark Theme</button>
      <button className="rounded mx-1 bg-slate-300 dark:bg-slate-900" onClick={() => setPreferredTheme('light')}>Set Light Theme</button>
    </div>
  )
}
