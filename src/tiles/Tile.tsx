import { SearchResult } from '../lib/search'
import styling from '../lib/styling'
import TileClosePak from './TileClosePak'
import TileDemo from './TileDemo'
import TileHelp from './TileHelp'
import TileLock from './TileLock'
import TileNewPak from './TileNewPak'
import TileNewPassword from './TileNewPassword'
import TileOpenPak from './TileOpenPak'
import TilePassword from './TilePassword'
import TileThemeSwitcher from './TileThemeSwitcher'
import TileUnlock from './TileUnlock'

export default function Tile({ searchResult }: { searchResult: SearchResult }): JSX.Element {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  } else if (searchResult.ov === 'pakrypt.command:unlock') {
    return <TileUnlock />
  } else if (searchResult.ov === 'pakrypt.command:lock') {
    return <TileLock />
  } else if (searchResult.ov === 'pakrypt.command:newpak') {
    return <TileNewPak />
  } else if (searchResult.ov === 'pakrypt.command:openpak') {
    return <TileOpenPak />
  } else if (searchResult.ov === 'pakrypt.command:closepak') {
    return <TileClosePak />
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
