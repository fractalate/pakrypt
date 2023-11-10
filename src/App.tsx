import ThemeSwitcher from "./components/ThemeSwitcher";
import { main } from "./lib/pak";
import { PageNoteEditExample } from "./pages/PageNoteEdit";
import { PagePasswordEditExample } from "./pages/PagePasswordEdit";
import ThemeContextProvider from "./components/ThemeContextProvider";

main(); // TODO: Remove this eventually.

export default function App() {
  return <ThemeContextProvider>
    <div className="
      min-h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
    ">
      <main>
        {true && <PagePasswordEditExample />}
        {false && <PageNoteEditExample />}
        <ThemeSwitcher />
        <ThemeSwitcher />
        <ThemeSwitcher />
        <ThemeSwitcher />
      </main>
    </div>
  </ThemeContextProvider>
}
