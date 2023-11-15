import ThemeContextProvider from './contexts/ThemeContextProvider'
import PageContextProvider from './contexts/PageContextProvider'
import Page from './pages/Page'
import PakContextProvider from './contexts/PakContextProvider'

export default function App() {
  return <ThemeContextProvider>
    <PakContextProvider>
      <PageContextProvider>
        <Page />
      </PageContextProvider>
    </PakContextProvider>
  </ThemeContextProvider>
}
