import { SearchResult } from "../lib/search";
import { TileNewPassword } from "./TileNewPassword";
import TileThemeSwitcher from "./TileThemeSwitcher";

export function computeTileKey(searchResult: SearchResult) {
  if ('id' in searchResult) {
    return searchResult.id;
  }
  return searchResult.ov;
}

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
