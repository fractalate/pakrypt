import { useState } from 'react'
import search, { SearchResult } from '../lib/search'
import Tile from '../tiles/Tile'
import styling from '../lib/styling'

function computeTileKey(searchResult: SearchResult) {
  if ('id' in searchResult) {
    return searchResult.id
  }
  return searchResult.ov
}

export default function PageMain() {
  const [query, setQuery] = useState('')
  const [tiles, setTiles] = useState([] as SearchResult[])

  function updateQuery(query: string) {
    setQuery(query)
    const tiles = search(query)
    setTiles(tiles)
  }

  const tileComponents = tiles.map((searchResult) => <div className="mb-1" key={computeTileKey(searchResult)}>
    <Tile searchResult={searchResult} />
  </div>)

  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <div className="p-1">
      <input type="text" className={styling.input.omnibarInput + ' w-full'} value={query} onChange={(e) => updateQuery(e.target.value)} />
    </div>
    {/* pb-1 here is so the mb-1 above in the tileComponents produced a m-1 margin between the omnibar input and the first tile. Consider learning how to use flex instead. */}
    <div className="pb-1 px-1">
      { tileComponents }
    </div>
  </div>
}
