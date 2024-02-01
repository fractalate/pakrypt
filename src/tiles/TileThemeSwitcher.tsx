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
    <div className={styling.tile.tileComponentCommand + ' flex flex-col gap-2'}>
      <div>
        Theme is {themeText}
      </div>
      <div className="flex flex-row gap-2">
        <button className={styling.button.formButton + ' w-1/3'} onClick={() => clearPreferredTheme()}>Use System Theme</button>
        <button className={styling.button.formButton + ' w-1/3'} onClick={() => setPreferredTheme('dark')}>Set Dark Theme</button>
        <button className={styling.button.formButton + ' w-1/3'} onClick={() => setPreferredTheme('light')}>Set Light Theme</button>
      </div>
    </div>
  )
}
