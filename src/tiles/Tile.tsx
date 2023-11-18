import { SearchResult } from '../lib/search'
import styling from '../lib/styling'
import { TileNewPassword } from './TileNewPassword'
import { TilePassword } from './TilePassword'
import TileThemeSwitcher from './TileThemeSwitcher'

export default function Tile({ searchResult }: { searchResult: SearchResult }) {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  } else if (searchResult.ov === 'pakrypt.password:1.0') {
    return <TilePassword entry={searchResult} />
  }
  return <div className={styling.tile.tileComponent}>
    { searchResult.ov }
  </div>
}
