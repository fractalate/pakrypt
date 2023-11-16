import ThemeContextProvider from './contexts/ThemeContextProvider'
import PakContextProvider from './contexts/PakContextProvider'
import Pages from './pages/Pages'

export default function App() {
  return <ThemeContextProvider>
    <PakContextProvider>
      <Pages />
    </PakContextProvider>
  </ThemeContextProvider>
}
