import { SearchResult } from '../lib/search'
import styling from '../lib/styling'
import TileDemo from './TileDemo'
import TileHelp from './TileHelp'
import TileNewPassword from './TileNewPassword'
import TilePassword from './TilePassword'
import TileThemeSwitcher from './TileThemeSwitcher'

export default function Tile({ searchResult }: { searchResult: SearchResult }): JSX.Element {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  } else if (searchResult.ov === 'pakrypt.command:new_file') {
    return <div className={styling.tile.tileComponentCommand}>
      { searchResult.ov }
    </div>
  } else if (searchResult.ov === 'pakrypt.command:new_note') {
    return <div className={styling.tile.tileComponentCommand}>
      { searchResult.ov }
    </div>
  } else if (searchResult.ov === 'pakrypt.command:demo') {
    return <TileDemo />
  } else if (searchResult.ov === 'pakrypt.command:help') {
    return <TileHelp />
  } else if (searchResult.ov === 'pakrypt.password:1.0') {
    return <TilePassword entry={searchResult} />
  } else if (searchResult.ov === 'pakrypt.file:1.0') {
    return <div className={styling.tile.tileComponentEntry}>
      { searchResult.ov }
    </div>
  } else if (searchResult.ov === 'pakrypt.note:1.0') {
    return <div className={styling.tile.tileComponentEntry}>
      { searchResult.ov }
    </div>
  }
  return searchResult
}
