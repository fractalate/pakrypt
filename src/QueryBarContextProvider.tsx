import { PropsWithChildren, useState } from 'react'
import { QueryBarContext } from './Contexts'

export default function QueryBarContextProvider({ children }: PropsWithChildren) {
  const [query, setQuery] = useState('')

  return <QueryBarContext.Provider value={{ query, setQuery }}>
    { children }
  </QueryBarContext.Provider>
}
