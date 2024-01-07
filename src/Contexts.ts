import { createContext } from 'react'
import { getAppliedTheme } from './lib/theme'
import { ChoosePage, PageContextState } from './pages'
import { PakmanStateContextState } from './pak/Pakman'
import { Pak } from './pak/Pak'

const nullPage: ChoosePage = {
  ov: 'pakrypt.page:main',
}

const nullJsxElement: JSX.Element = {} as JSX.Element // XXX: What's a better null JSX element?

const nullPageContextState: PageContextState = {
  pages: [ [nullPage, '', nullJsxElement] ],
  pushPage: () => {},
  popPage: () => {},
  replacePage: () => {},
}

const nullPakmanStateContextState: PakmanStateContextState = {
  pakman: { ov: 'pakrypt.pakman_state:unloaded' },
  setPakman: () => {},
}

interface QueryBarContextState {
  query: string,
  setQuery: (query: string) => void,
}

const nullQueryBarContextState: QueryBarContextState = {
  query: '',
  setQuery: () => {},
}

export const PageContext = createContext(nullPageContextState)
export const ThemeContext = createContext(getAppliedTheme())
export const PakmanStateContext = createContext(nullPakmanStateContextState)
export const PakContext = createContext(null as null | Pak)
export const QueryBarContext = createContext(nullQueryBarContextState)
