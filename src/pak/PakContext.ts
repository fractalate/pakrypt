import { createContext } from 'react'
import { Pak, Pak1r0_Entry } from './Pak'

export const PakManagerContext = createContext({})

// TODO: These might go away?
export const PakContext = createContext(null as null | Pak)
export const PakContextRevision = createContext('')
export const PakContextEntry = createContext(null as null | Pak1r0_Entry)
