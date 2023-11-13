import { createContext } from 'react';
import { getAppliedTheme } from './lib/theme';
import { Experience } from './lib/experience';

const nullExperience: Experience = {
  pushExperience: () => {},
  popExperience: () => {},
}

export const ExperienceContext = createContext(nullExperience);
export const ThemeContext = createContext(getAppliedTheme()); // See also: The ThemeContextProvider component.
