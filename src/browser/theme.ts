const THEME_KEY = 'theme';

export type Theme = 'dark' | 'light';

const themeSwitchListeners: ((theme: Theme) => void)[] = [];
let currentSystemTheme: Theme = 'light'
let usingPreferredTheme = false;

export function getSystemTheme(): Theme {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return dark ? 'dark' : 'light';
}

export function getPreferredTheme(): '' | Theme {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme == null) {
    return '';
  } else if (theme === '' || theme === 'light' || theme === 'dark') {
    return theme;
  }
  console.error('Unsupported preferred theme ' + JSON.stringify(theme) + '. Using fallback.');
  return '';
}

export function computeTheme(): Theme {
  const theme = getPreferredTheme();
  if (theme === '') {
    return getSystemTheme();
  }
  return theme;
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function getAppliedTheme(): Theme {
  const dark = document.documentElement.classList.contains('dark');
  return dark ? 'dark' : 'light';
}

export function setGlobalTheme(theme: '' | Theme): Theme {
  if (theme === '') {
    return clearGlobalTheme();
  }
  localStorage.setItem(THEME_KEY, theme);
  usingPreferredTheme = true;
  applyTheme(theme);
  return theme;
}

export function clearGlobalTheme(): Theme {
  localStorage.removeItem(THEME_KEY);
  usingPreferredTheme = false;
  const theme = computeTheme();
  applyTheme(theme);
  return theme;
}

export function startupTheme() {
  currentSystemTheme = getSystemTheme();
  const preferredTheme = getPreferredTheme();
  usingPreferredTheme = preferredTheme != '';
  let appliedTheme = preferredTheme == '' ? currentSystemTheme : preferredTheme;
  applyTheme(appliedTheme);

  // Check for changed theme every so often and apply it.
  // Is there a way to do this without polling?
  setInterval(() => {
    const nowSystemTheme = getSystemTheme();
    if (nowSystemTheme == currentSystemTheme) {
      return;
    }
    console.log('detected system theme change from ' + currentSystemTheme + ' to ' + nowSystemTheme + '.');
    if (!usingPreferredTheme) {
      applyTheme(nowSystemTheme);
    }
    currentSystemTheme = nowSystemTheme;
    notifyThemeSwitchListeners(nowSystemTheme);
  }, 2000);
}

export function addThemeSwitchListener(listener: (theme: Theme) => void) {
  themeSwitchListeners.push(listener);
}

export function removeThemeSwitchListener(listener: (theme: Theme) => void) {
  const index = themeSwitchListeners.indexOf(listener);
  if (index >= 0) {
    themeSwitchListeners.splice(index, 1);
  }
}

function notifyThemeSwitchListeners(theme: Theme) {
  for (const listener of themeSwitchListeners) {
    // Call the listener in another context so errors don't affect other listeners.
    setTimeout(() => {
      listener(theme);
    }, 0);
  }
}
