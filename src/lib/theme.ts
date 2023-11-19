export type Theme = 'dark' | 'light';

const THEME_KEY = 'pakrypt.theme'
const themeSwitchListeners: ((theme: Theme) => void)[] = []

export function getSystemTheme(): Theme {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return dark ? 'dark' : 'light'
}

export function getPreferredTheme(): '' | Theme {
  const theme = localStorage.getItem(THEME_KEY)
  if (theme == null) {
    return ''
  } else if (theme === '' || theme === 'light' || theme === 'dark') {
    return theme
  }
  console.error('Unsupported preferred theme ' + JSON.stringify(theme) + '. Using fallback.')
  return ''
}

export function setPreferredTheme(theme: '' | Theme): Theme {
  if (theme === '') {
    return clearPreferredTheme()
  }
  console.debug('Setting local storage item ' + THEME_KEY + ' to ' + JSON.stringify(theme) + '.')
  localStorage.setItem(THEME_KEY, theme)
  return computeAndApplyTheme()
}

export function clearPreferredTheme(): Theme {
  console.debug('Removing local storage item ' + THEME_KEY + '.')
  localStorage.removeItem(THEME_KEY)
  return computeAndApplyTheme()
}

export function getAppliedTheme(): Theme {
  const dark = document.documentElement.classList.contains('dark')
  return dark ? 'dark' : 'light'
}

export function startupTheme() {
  computeAndApplyTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    computeAndApplyTheme()
  })
}

export function addThemeSwitchListener(listener: (theme: Theme) => void) {
  themeSwitchListeners.push(listener)
}

export function removeThemeSwitchListener(listener: (theme: Theme) => void) {
  const index = themeSwitchListeners.indexOf(listener)
  if (index >= 0) {
    themeSwitchListeners.splice(index, 1)
  }
}

function computeAndApplyTheme() {
  const currentTheme = getAppliedTheme()
  const theme = computeTheme()
  if (currentTheme != theme) {
    applyTheme(theme)
    notifyThemeSwitchListeners(theme)
  }
  return theme
}

function computeTheme(): Theme {
  const theme = getPreferredTheme()
  if (theme === '') {
    return getSystemTheme()
  }
  return theme
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function notifyThemeSwitchListeners(theme: Theme) {
  for (const listener of themeSwitchListeners) {
    // Call the listener in another context so errors don't affect other listeners.
    setTimeout(() => {
      listener(theme)
    }, 0)
  }
}
