import { SearchResult } from "../lib/search";

export function computeTileKey(searchResult: SearchResult) {
  if ('id' in searchResult) {
    return searchResult.id;
  }
  return searchResult.ov;
}

export default function Tile({ searchResult }: { searchResult: SearchResult }) {
  return <div>
    { searchResult.ov }
  </div>
}
