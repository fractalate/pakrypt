import { useContext } from "react";
import { Theme, clearPreferredTheme, setPreferredTheme } from "../lib/theme";
import { ThemeContext } from "../Contexts";
import styling from "../lib/styling";

function computeThemeText(theme: Theme): string {
  return theme;
}

export default function TileThemeSwitcher() {
  const themeText = computeThemeText(useContext(ThemeContext));

  return (
    <div className={styling.tile.tileComponent}>
      <div className="text-base font-semibold">Theme is {themeText}</div>
      <div className="flex flex-row gap-2">
        <button
          className={styling.button.formButton}
          onClick={() => clearPreferredTheme()}
        >
          Set No Theme
        </button>
        {/* mr-1 is because I should really learn Flex. */}
        <button
          className={styling.button.formButton}
          onClick={() => setPreferredTheme("dark")}
        >
          Set Dark Theme
        </button>
        <button
          className={styling.button.formButton}
          onClick={() => setPreferredTheme("light")}
        >
          Set Light Theme
        </button>
      </div>
      {/* mr-1 is because I should really learn Flex. */}
    </div>
  );
}
