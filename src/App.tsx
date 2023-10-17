import Omnibar from './Omnibar';

export type ColorTheme = '' | 'light' | 'dark';

function loadColorTheme(): ColorTheme {
// TODO: Figure out the light/dark theme with javascript. https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
  const value = localStorage.getItem('color-theme');
  if (value == null) {
    return '';
  } else if (value == '' || value == 'light' || value == 'dark') {
    return value;
  }
  console.error('Invalid color theme! ' + value);
  return '';
}

_setTheme(loadColorTheme());


// XXX: This is hacky. Replace a toggle control or something.
var currentTheme = loadColorTheme(); // TODO: Double loading, but this is here for tests.
function _setTheme(theme: ColorTheme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
// XXX: This is hacky. Replace a toggle control or something.
(window as any).setTheme = function(theme: ColorTheme) {
  localStorage.setItem('color-theme', theme);
  _setTheme(theme);
};
// XXX: This is hacky. Replace a toggle control or something.
(window as any).swapTheme = function() {
  if (currentTheme == 'dark') {
  	(window as any).setTheme('light');
  } else {
    (window as any).setTheme('dark');
  }
};
// XXX: This is hacky. Replace a toggle control or something.
(window as any).swapOn = function() {
  setInterval((window as any).swapTheme, 2000);
};

function App() {
  return (
    <div className={`
      h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
    `}>
      <svg className="h-screen w-screen absolute left-0 right-0 top-0 bottom-0">
        <line x1="75%" y1="0" x2="75%" y2="100%" className="stroke-[#EED] dark:stroke-[#434]" style={{
          strokeWidth: 20, // TODO: I want centimeters or something.
        }}></line>
      </svg>
      {/* TODO: Why does position: relative help here? Otherwise the SVG is on top of Omnibar */}
      <div className="relative">
        <Omnibar />
      </div>
    </div>
  )
}

export default App
