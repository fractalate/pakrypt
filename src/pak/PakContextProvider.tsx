import { PropsWithChildren, useMemo, useState } from 'react'
import { NewPak, Pak } from './Pak'
import { PakContext } from './PakContext'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => NewPak(), [])
  const [pak, setPak] = useState(initialPak as null | Pak)
  const value = {
    pak,
    setPak: (pak: null | Pak) => {
      setPak(pak)
    },
  }

  return <PakContext.Provider value={value}>
    {children}
  </PakContext.Provider>
}
