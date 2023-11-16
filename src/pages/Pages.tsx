import { useMemo, useState } from "react"
import { PageContext } from "../contexts"
import { v4 as uuid } from "uuid";
import Page from "./Page";

export default function Pages() {
  const initialPage: ChosenPage = useMemo(() => {
    const page: ChoosePage = {
      ov: 'pakrypt.page:main',
    }
    return [page, uuid(), <Page page={page} />]
  }, []);
  
  const [pages, setPages] = useState([initialPage]) // Remember: don't modify this in-place.
  
  const pageContextState = useMemo(() => {
    return {
      pages,
      pushPage: (page: ChoosePage) => {
        setPages([...pages, [page, uuid(), <Page page={page} /> ]])
      },
      popPage: () => {
        setPages(pages.slice(0, -1))
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
