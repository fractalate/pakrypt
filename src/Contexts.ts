import { createContext } from 'react'
import { getAppliedTheme } from './lib/theme'
import { Pak } from './lib/pak'
import { ChoosePage, PageContextState } from './pages';

const nullPage: ChoosePage = {
  ov: 'pakrypt.page:main',
}

const nullJsxElement: JSX.Element = {} as JSX.Element; // TODO: What's a better null JSX element?

const nullPageContextState: PageContextState = {
  pages: [ [nullPage, '', nullJsxElement] ],
  pushPage: () => {},
  popPage: () => {},
}

export const PageContext = createContext(nullPageContextState)
export const PakContext = createContext(null as null | Pak) // See also: The PakContextProvider component.
export const ThemeContext = createContext(getAppliedTheme()) // See also: The ThemeContextProvider component.
