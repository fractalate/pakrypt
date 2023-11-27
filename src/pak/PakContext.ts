import { createContext } from 'react'
import { Pak, PakEntry } from './Pak'

export const PakContext = createContext(null as null | Pak)
export const PakEntryContext = createContext(null as null | PakEntry)
