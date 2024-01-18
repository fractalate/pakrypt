import { SearchResult } from '../lib/search'
import TileChangePassphrase from './TileChangePassphrase'
import TileClosePak from './TileClosePak'
import TileCopyPak from './TileCopyPak'
import TileDebug from './TileDebug'
import TileDeletePak from './TileDeletePak'
import TileExportPak from './TileExportPak'
import TileFile from './TileFile'
import TileHelp from './TileHelp'
import TileImportPak from './TileImportPak'
import TileLock from './TileLock'
import TileNewFile from './TileNewFile'
import TileNewNote from './TileNewNote'
import TileNewPak from './TileNewPak'
import TileNewPassword from './TileNewPassword'
import TileNote from './TileNote'
import TileOpenPak from './TileOpenPak'
import TilePassword from './TilePassword'
import TileThemeSwitcher from './TileThemeSwitcher'
import TileUnlock from './TileUnlock'
import TileVersion from './TileVersion'

export default function Tile({ searchResult }: { searchResult: SearchResult }): JSX.Element {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  } else if (searchResult.ov === 'pakrypt.command:new_pak') {
    return <TileNewPak />
  } else if (searchResult.ov === 'pakrypt.command:open_pak') {
    return <TileOpenPak />
  } else if (searchResult.ov === 'pakrypt.command:copy_pak') {
    return <TileCopyPak />
  } else if (searchResult.ov === 'pakrypt.command:close_pak') {
    return <TileClosePak />
  } else if (searchResult.ov === 'pakrypt.command:unlock') {
    return <TileUnlock />
  } else if (searchResult.ov === 'pakrypt.command:lock') {
    return <TileLock />
  } else if (searchResult.ov === 'pakrypt.command:new_file') {
    return <TileNewFile />
  } else if (searchResult.ov === 'pakrypt.command:new_note') {
    return <TileNewNote />
  } else if (searchResult.ov === 'pakrypt.command:help') {
    return <TileHelp />
  } else if (searchResult.ov === 'pakrypt.password:1.0') {
    return <TilePassword entry={searchResult} />
  } else if (searchResult.ov === 'pakrypt.file:1.0') {
    return <TileFile entry={searchResult} />
  } else if (searchResult.ov === 'pakrypt.note:1.0') {
    return <TileNote entry={searchResult} />
  } else if (searchResult.ov === 'pakrypt.command:delete_pak') {
    return <TileDeletePak />
  } else if (searchResult.ov === 'pakrypt.command:change_passphrase') {
    return <TileChangePassphrase />
  } else if (searchResult.ov === 'pakrypt.command:export_pak') {
    return <TileExportPak />
  } else if (searchResult.ov === 'pakrypt.command:import_pak') {
    return <TileImportPak />
  } else if (searchResult.ov === 'pakrypt.command:version') {
    return <TileVersion />
  } else if (searchResult.ov === 'pakrypt.command:debug_menu') {
    return <TileDebug />
  }
  return searchResult
}
