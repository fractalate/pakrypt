import { PropsWithChildren, useState } from 'react'
import { Pak1r0_Entry } from './Pak'
import { PakEntryContext } from './PakContext'

export default function PakEntryContextProvider({ children }: PropsWithChildren) {
  const [entry, _setEntry] = useState(null as null | Pak1r0_Entry)

  return <PakEntryContext.Provider value={entry}>
    {children}
  </PakEntryContext.Provider>
}
