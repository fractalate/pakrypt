import { SearchResult } from '../lib/search'
import styling from '../lib/styling'
import { TileNewPassword } from './TileNewPassword'
import TileThemeSwitcher from './TileThemeSwitcher'

export default function Tile({ searchResult }: { searchResult: SearchResult }) {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  }
  return <div className={styling.tile.tileComponent}>
    { searchResult.ov }
  </div>
}
