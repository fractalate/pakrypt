import { PropsWithChildren, useMemo, useState } from 'react'
import { NewPak1r0, Pak } from './Pak'
import { PakContext } from './PakContext'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => NewPak1r0(), [])
  const [pak, _setPak] = useState(initialPak as null | Pak)

  return <PakContext.Provider value={pak}>
    {children}
  </PakContext.Provider>
}
