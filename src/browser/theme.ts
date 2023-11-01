const THEME_KEY = 'theme';

// The empty string represents system preference.
export type ColorTheme = 'dark' | 'light';

function getSystemTheme(): ColorTheme {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return dark ? 'dark' : 'light';
}

function getSavedTheme(): '' | ColorTheme {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme == null) {
    return '';
  } else if (theme === '' || theme === 'light' || theme === 'dark') {
    return theme;
  }
  console.error('Unsupported saved theme ' + JSON.stringify(theme) + '. Using default');
  return '';
}

function computeColorTheme(): ColorTheme {
  const theme = getSavedTheme();
  if (theme === '') {
    return getSystemTheme();
  }
  return theme;
}

function applyTheme(theme: ColorTheme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function getAppliedTheme(): ColorTheme {
  const dark = document.documentElement.classList.contains('dark');
  return dark ? 'dark' : 'light';
}

function _startup() {
  let theme = loadColorTheme();
  applyTheme(theme == '' ? 'light' : theme);
}

function setTheme(theme: '' | ColorTheme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme == '' ? 'light' : theme);
}

function startup() {
  _startup();

  setInterval(() => {
    const appliedTheme = getAppliedTheme();
    const theme = loadColorTheme();
    if (theme != appliedTheme) {
      console.warn('Here, let me fix the color theme for you.');
      applyTheme(theme == '' ? 'light' : theme);
    }
  }, 1000);
}

export default {
  setTheme,
  startup,
};
