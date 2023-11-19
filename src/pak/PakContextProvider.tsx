import { PropsWithChildren, useMemo, useState } from 'react'
import { NewPak1r0, Pak, Pak1r0_Entry } from './Pak'
import { PakContext, PakContextEntry, PakContextRevision, PakManagerContext } from './PakContext'
import { v4 as uuid } from 'uuid'

// TODO: Expand this context provider idea to provide all methods required for working with the Pak.

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialRevision = useMemo(() => uuid(), [])
  const [revision, setRevision] = useState(initialRevision)
  const initialPak = useMemo(() => NewPak1r0(), [])
  const [pak, setPak] = useState(initialPak as null | Pak)
  const [entry, setEntry] = useState(null as null | Pak1r0_Entry)

  const manager = {
  }

  return <PakManagerContext.Provider value={manager}>
    <PakContext.Provider value={pak}>
      <PakContextRevision.Provider value={revision}>
        <PakContextEntry.Provider value={entry}>
          {children}
        </PakContextEntry.Provider>
      </PakContextRevision.Provider>
    </PakContext.Provider>
  </PakManagerContext.Provider>
}
