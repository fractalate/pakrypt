export default function App() {
  return (
    <div className={`
      ${theme}
      h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
    `}>
      Theme is {theme}
      <br/>
      <button onClick={() => setTheme('')}>Set No Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={() => setTheme('light')}>Set Light Theme</button>
    </div>
  )
}
