import { createContext } from 'react';
import { getAppliedTheme } from './lib/theme';

export const ThemeContext = createContext(getAppliedTheme()); // See also: The ThemeContextProvider component.
