import { PropsWithChildren, useMemo, useState } from 'react'
import { NewPak1r0, Pak } from '../lib/pak'
import { PakContext } from '.'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => NewPak1r0(), [])
  const [pak, _setPak] = useState(initialPak as Pak)

  return <PakContext.Provider value={pak}>
    {children}
  </PakContext.Provider>
}
