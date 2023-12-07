import { useContext } from 'react'
import { Theme, clearPreferredTheme, setPreferredTheme } from '../lib/theme'
import { ThemeContext } from '../Contexts'
import styling from '../lib/styling'

function computeThemeText(theme: Theme): string {
  return theme
}

export default function TileThemeSwitcher() {
  const themeText = computeThemeText(useContext(ThemeContext))

  return (
    <div className={styling.tile.tileComponentCommand}>
      <div>
        Theme is {themeText}
      </div>
      <div className="m-1"></div>
      {/* mr-1 is because I should really learn Flex. */}
      <button className={styling.button.formButton + ' mr-1'} onClick={() => clearPreferredTheme()}>Set No Theme</button>
      {/* mr-1 is because I should really learn Flex. */}
      <button className={styling.button.formButton + ' mr-1'} onClick={() => setPreferredTheme('dark')}>Set Dark Theme</button>
      <button className={styling.button.formButton} onClick={() => setPreferredTheme('light')}>Set Light Theme</button>
    </div>
  )
}
