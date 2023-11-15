import { PropsWithChildren, useMemo, useState } from 'react'
import { PageContext } from '.'

const initialPage: ChoosePage = {
  ov: 'pakrypt.page:main',
}

export default function PageContextProvider({ children }: PropsWithChildren) {
  const [page, setPage] = useState(initialPage)
  const pageContextState: PageContextState = useMemo(() => {
    return {
      page,
      setPage,
    }
  }, [page, setPage])
  
  return <PageContext.Provider value={pageContextState}>
    { children }
  </PageContext.Provider>
}
