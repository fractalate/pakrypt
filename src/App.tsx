import PageContextProvider from './PageContextProvider'
import PakmanStateContextProvider from './PakmanStateContextProvider'
import QueryBarContextProvider from './QueryBarContextProvider'
import ThemeContextProvider from './ThemeContextProvider'

export default function App() {
  return <ThemeContextProvider>
    <QueryBarContextProvider>
      <PakmanStateContextProvider>
        <PageContextProvider />
      </PakmanStateContextProvider>
    </QueryBarContextProvider>
  </ThemeContextProvider>
}
