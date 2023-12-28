import { useContext, useMemo } from 'react'
import search, { SearchResult } from '../lib/search'
import Tile from '../tiles/Tile'
import styling from '../lib/styling'
import { PakmanStateContext, QueryBarContext } from '../Contexts'

function computeTileKey(searchResult: SearchResult) {
  if ('id' in searchResult) {
    return searchResult.id
  }
  return searchResult.ov
}

export default function PageMain() {
  const { query, setQuery } = useContext(QueryBarContext)
  const { pakman } = useContext(PakmanStateContext)
  const tiles = useMemo(() => search(query, pakman), [query, pakman])

  const tileComponents = tiles.map((searchResult) => <div className="mb-1" key={computeTileKey(searchResult)}>
    <Tile searchResult={searchResult} />
  </div>)

  let message = 'Type "help" for help.'
  if (pakman.ov == 'pakrypt.pakmanstate:unloaded') {
    message = 'No pak. ' + message
  } else if (pakman.ov == 'pakrypt.pakmanstate:loaded') {
    message = '"' + pakman.name + '" is locked. ' + message
  } else if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
    message = '"' + pakman.name + '" is ready! ' + message
  }

  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <div className="p-1">
      <input type="text" className={styling.input.omnibarInput + ' w-full'} autoFocus={true} placeholder={message} value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
    {/* pb-1 here is so the mb-1 above in the tileComponents produced a m-1 margin between the omnibar input and the first tile. Consider learning how to use flex instead. */}
    <div className="pb-1 px-1">
      { tileComponents }
    </div>
  </div>
}
