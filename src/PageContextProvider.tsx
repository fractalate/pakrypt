import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { PageContext } from './Contexts'
import { ChoosePage, ChosenPage } from './pages'
import Page from './pages/Page'

export default function PageContextProvider() {
  const initialPage: ChosenPage = useMemo(() => {
    const page: ChoosePage = {
      ov: 'pakrypt.page:main',
    }
    return [page, uuid(), <Page page={page} />]
  }, [])
  
  // Don't modify the pages array. Create a new array and use setPages().
  const [pages, setPages] = useState([initialPage])
  
  const pageContextState = useMemo(() => {
    return {
      pages,
      pushPage: (page: ChoosePage) => {
        setPages([...pages, [page, uuid(), <Page page={page} />]])
      },
      popPage: () => {
        setPages(pages.slice(0, -1))
      },
      replacePage: (page: ChoosePage) => {
        setPages([...pages.slice(0, -1), [page, uuid(), <Page page={page} />]])
      },
    }
  }, [pages, setPages])
  
  const rendered = pages.map(([ , id, component], index) => <div key={id} className={index < pages.length - 1 ? 'hidden' : ''}>
    { component }
  </div>)

  return <PageContext.Provider value={pageContextState}>
    { rendered }
  </PageContext.Provider>
}
