import { useContext } from 'react'
import { PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { PakmanLock } from '../pak/Pakman'

export default function TileLock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    return <></>
  }

  const doLock = () => {
    setPakman(PakmanLock(pakman))
    setQuery('')
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => doLock()}>Lock</button>
  </div>
}
