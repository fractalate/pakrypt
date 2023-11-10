import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { addThemeSwitchListener, getAppliedTheme, removeThemeSwitchListener } from "../lib/theme";
import { ThemeContext } from "../Contexts";

export default function ThemeContextProvider({ children }: PropsWithChildren) {
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

  return ThemeContext.Provider({
    children,
    value: currentTheme
  })
}
