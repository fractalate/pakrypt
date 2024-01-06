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
  if (pakman.ov == 'pakrypt.pakman_state:unloaded') {
    message = 'No pak. ' + message
  } else if (pakman.ov == 'pakrypt.pakman_state:loaded') {
    message = '"' + pakman.name + '" is locked. ' + message
  } else if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
    message = '"' + pakman.name + '" is ready! ' + message
  }

  return <div className={styling.page.regular}>
    <div>
      <input type="text" className={styling.input.omnibarInput + ' w-full'} autoFocus={true} placeholder={message} value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
    <div>
      { tileComponents }
    </div>
  </div>
}
