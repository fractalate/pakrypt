import { useContext } from 'react'
import { PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { PakmanClose } from '../pak/Pakman'

export default function TileClosePak() {
  const { setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => {
      setPakman(PakmanClose())
      setQuery('')
    }}>Close Pak</button>
  </div>
}
