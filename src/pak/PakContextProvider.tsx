import { PropsWithChildren, useMemo, useState } from 'react'
import { CreatePassword, NewPak, Pak } from './Pak'
import { PakContext } from './PakContext'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => {
    let pak = NewPak()
    pak = CreatePassword(pak, {
      title: 'Whelp Another Site',
      subtitle: '',
      username: 'megauser',
      password: 'password',
    })[0]
    pak = CreatePassword(pak, {
      title: 'Lines vs. Strips',
      subtitle: 'lvs.cochleoid.com',
      username: 'anonymous',
      password: 'person',
    })[0]
    pak = CreatePassword(pak, {
      title: 'how2recycle.info',
      subtitle: 'Recycle Now!',
      username: 'reusedusername',
      password: 'password1',
    })[0]
    return pak
  }, [])
  const [pak, setPak] = useState(initialPak as null | Pak)
  const value = {
    pak,
    setPak: (pak: null | Pak) => {
      setPak(pak)
    },
  }

  return <PakContext.Provider value={value}>
    {children}
  </PakContext.Provider>
}
