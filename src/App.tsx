import ThemeSwitcher from "./components/ThemeSwitcher";
import { PageNoteEditExample } from "./pages/PageNoteEdit";
import { PagePasswordEditExample } from "./pages/PagePasswordEdit";
import ThemeContextProvider from "./components/ThemeContextProvider";
import { useState } from "react";
import search from "./lib/search";
import Tile, { computeTileKey } from "./components/Tile";
import ExperienceContextProvider from "./components/ExperienceContextProvider";

export default function App() {
  const [query, setQuery] = useState('');

  const searchResults = search(query);
  let tiles = searchResults.map((searchResult) => <Tile
    key={computeTileKey(searchResult)}
    searchResult={searchResult}
  />)

  return <ThemeContextProvider>
    <ExperienceContextProvider>
      <div className="
        min-h-screen w-screen
        text-[#333] bg-[#FFE]
        dark:text-[#EED] dark:bg-[#323]
      ">
        <main>
          {/* TODO: The input needs to be separated into a component so that the app rerenders itself less often. */}
          <input className={`
            px-1 py-2
            w-full
            border-2 rounded
            bg-white dark:bg-black
            border-black/30 dark:border-white/30
          `}type="text" value={query} onChange={(e) => setQuery(e.target.value)}></input>
          {tiles}
          {false && <PagePasswordEditExample />}
          {false && <PageNoteEditExample />}
          {false && <ThemeSwitcher />}
        </main>
      </div>
    </ExperienceContextProvider>
  </ThemeContextProvider>
}
