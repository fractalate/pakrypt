import { PropsWithChildren, useMemo, useState } from 'react'
import { PakmanStateContext } from './Contexts'
import { Pakman, PakmanLoadDefault } from './pak/Pakman'

export default function PakmanStateContextProvider({ children }: PropsWithChildren) {
  const initialPakman = useMemo((): Pakman => {
    const [pakman] = PakmanLoadDefault()
    return pakman
  }, [])

  const [pakman, setPakman] = useState(initialPakman)

  return <PakmanStateContext.Provider value={{ pakman, setPakman }}>
    { children }
  </PakmanStateContext.Provider>
}
