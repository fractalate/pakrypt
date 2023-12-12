import PageContextProvider from './PageContextProvider'
import PakmanStateContextProvider from './PakmanStateContextProvider'
import ThemeContextProvider from './ThemeContextProvider'

export default function App() {
  return <ThemeContextProvider>
    <PakmanStateContextProvider>
      <PageContextProvider />
    </PakmanStateContextProvider>
  </ThemeContextProvider>
}
