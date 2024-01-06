import { PropsWithChildren, useMemo, useState } from 'react'
import { PakmanStateContext } from './Contexts'
import { Pakman, PakmanLoadLast, PakmanSetLast } from './pak/Pakman'

export default function PakmanStateContextProvider({ children }: PropsWithChildren) {
  const initialPakman = useMemo((): Pakman => {
    const [pakman] = PakmanLoadLast()
    return pakman
  }, [])

  const [pakman, _setPakman] = useState(initialPakman)

  function setPakman(pakman: Pakman) {
    if (pakman.ov == 'pakrypt.pakman_state:unloaded') {
      PakmanSetLast(null)
    } else {
      PakmanSetLast(pakman.name)
    }
    console.log('really gonna do it', pakman)
    _setPakman(pakman)
  }

  return <PakmanStateContext.Provider value={{ pakman, setPakman }}>
    { children }
  </PakmanStateContext.Provider>
}
