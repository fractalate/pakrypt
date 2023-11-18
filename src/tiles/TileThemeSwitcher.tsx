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
    <div className={styling.tile.tileComponent}>
      Theme is {themeText}
      <br/>
      <button className={styling.button.formButton} onClick={() => clearPreferredTheme()}>Set No Theme</button>
      <button className={styling.button.formButton} onClick={() => setPreferredTheme('dark')}>Set Dark Theme</button>
      <button className={styling.button.formButton} onClick={() => setPreferredTheme('light')}>Set Light Theme</button>
    </div>
  )
}
