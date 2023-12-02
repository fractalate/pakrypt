import { createContext } from 'react'
import { Pak, PakEntry } from './Pak'

interface PakContextValue {
  pak: null | Pak,
  setPak: (pak: null | Pak) => void,
}

const nullPakContextValue: PakContextValue = {
  pak: null,
  setPak: () => {},
}

export const PakContext = createContext(nullPakContextValue)
export const PakEntryContext = createContext(null as null | PakEntry)
