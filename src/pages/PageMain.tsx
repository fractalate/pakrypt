import { useState } from "react";
import search, { SearchResult } from "../lib/search";
import Tile from "../tiles/Tile";

export function computeTileKey(searchResult: SearchResult) {
  if ('id' in searchResult) {
    return searchResult.id;
  }
  return searchResult.ov;
}

export default function PageMain() {
  console.log('rendering PageMain')
  const [query, setQuery] = useState('')
  const [tiles, setTiles] = useState([] as SearchResult[])

  function updateQuery(query: string) {
    setQuery(query)
    const tiles = search(query);
    console.debug('query changed, tiles =', tiles)
    setTiles(tiles);
  }

  const tileComponents = tiles.map((searchResult) => <Tile key={computeTileKey(searchResult)} searchResult={searchResult} />);

  // TODO: Move these styles or page object into somewhere common.
  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <input type="text" value={query} onChange={(e) => updateQuery(e.target.value)} />
    <div>
      { tileComponents }
    </div>
  </div>
}
