import { PropsWithChildren, useState } from 'react'
import { PakEntry } from './Pak'
import { PakEntryContext } from './PakContext'

export default function PakEntryContextProvider({ children }: PropsWithChildren) {
  const [entry] = useState(null as null | PakEntry)

  return <PakEntryContext.Provider value={entry}>
    {children}
  </PakEntryContext.Provider>
}
