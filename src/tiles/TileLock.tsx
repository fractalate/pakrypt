import { useContext } from 'react'
import { PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { PakmanLock } from '../pak/Pakman'

export default function TileLock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    return <></>
  }

  const doLock = () => {
    setPakman(PakmanLock(pakman))
    setQuery('')
  }
  
  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => doLock()}>Lock</button>
  </div>
}
