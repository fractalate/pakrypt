import { createContext } from 'react'
import { getAppliedTheme } from '../lib/theme'
import { Pak } from '../lib/pak'

const nullPage: ChoosePage = {
  ov: 'pakrypt.page:main',
}

const nullJsxElement = {} as JSX.Element; // TODO: What's a better null JSX element?

const nullPageContextState: PageContextState = {
  pages: [ [nullPage, '', nullJsxElement] ],
  pushPage: () => {},
  popPage: () => {},
}

export const PageContext = createContext(nullPageContextState)
export const PakContext = createContext(null as null | Pak) // See also: The PakContextProvider component. TODO make sure this exists.
export const ThemeContext = createContext(getAppliedTheme()) // See also: The ThemeContextProvider component. TODO make sure this exists still.
