import { PropsWithChildren, useMemo, useState } from 'react'
import { NewPak, Pak } from './Pak'
import { PakContext } from './PakContext'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => NewPak(), [])
  const [pak] = useState(initialPak as null | Pak)

  return <PakContext.Provider value={pak}>
    {children}
  </PakContext.Provider>
}
