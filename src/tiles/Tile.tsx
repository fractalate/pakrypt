import { SearchResult } from "../lib/search";
import { TileNewPassword } from "./TileNewPassword";
import TileThemeSwitcher from "./TileThemeSwitcher";

export default function Tile({ searchResult }: { searchResult: SearchResult }) {
  if (searchResult.ov === 'pakrypt.command:new_password') {
    return <TileNewPassword />
  } else if (searchResult.ov === 'pakrypt.command:theme_switcher') {
    return <TileThemeSwitcher />
  }
  return <div>
    { searchResult.ov }
  </div>
}
