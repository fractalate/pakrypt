import { PropsWithChildren, useState } from 'react'
import { QueryBarContext } from './Contexts'

export default function QueryBarContextProvider({ children }: PropsWithChildren) {
  const [initialVisit, setInitialVisit] = useState(true)
  const [query, _setQuery] = useState('')

  const setQuery = (query: string) => {
    _setQuery(query)
    setInitialVisit(false)
  }

  return <QueryBarContext.Provider value={{ initialVisit, query, setQuery }}>
    { children }
  </QueryBarContext.Provider>
}
