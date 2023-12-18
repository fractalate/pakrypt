import { createContext } from 'react'
import { getAppliedTheme } from './lib/theme'
import { ChoosePage, PageContextState } from './pages'
import { PakmanStateContextState } from './pak/Pakman'
import { Pak } from './pak/Pak'

interface QueryBarContextState { // TODO: Type belongs somewhere else?
  query: string,
  setQuery: (query: string) => void,
}

const nullPage: ChoosePage = {
  ov: 'pakrypt.page:main',
}

const nullJsxElement: JSX.Element = {} as JSX.Element // TODO: What's a better null JSX element?

const nullPageContextState: PageContextState = {
  pages: [ [nullPage, '', nullJsxElement] ],
  pushPage: () => {},
  popPage: () => {},
  replacePage: () => {},
}

const nullPakmanStateContextState: PakmanStateContextState = {
  pakman: { ov: 'pakrypt.pakmanstate:unloaded' },
  setPakman: () => {},
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
