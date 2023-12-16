import { useContext } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { PakmanClose } from '../pak/Pakman'

export default function TileClosePak() {
  const { setPakman } = useContext(PakmanStateContext)

  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => {
      setPakman(PakmanClose())
    }}>Close Pak</button>
  </div>
}
