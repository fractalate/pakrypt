import { useContext } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { PakmanLock } from '../pak/Pakman'

export default function TileLock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    return <>xxx</>
  }

  const doLock = () => {
    setPakman(PakmanLock(pakman))
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => doLock()}>Lock</button>
  </div>
}
