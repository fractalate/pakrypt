import { PropsWithChildren, useMemo, useState } from 'react'
import { CreatePassword, NewPak, Pak } from './Pak'
import { PakContext } from './PakContext'

export default function PakContextProvider({ children }: PropsWithChildren) {
  const initialPak = useMemo(() => {
    let pak: null | Pak = null
    for (const key of Object.keys(localStorage)) {
      // "pakrypt.pak[default]"
      if (/^pakrypt.pak\[\w+\]$/.test(key)) {
        const pakData = localStorage.getItem(key)
        if (pakData == null) {
          continue
        }
        // TODO: Handling error? Ensuring proper structure?
        pak = JSON.parse(pakData)
      }
    }

    if (pak == null) {
      pak = NewPak()
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
    }
  
    return pak
  }, [])
  const [pak, setPak] = useState(initialPak as null | Pak)
  const value = {
    pak,
    setPak: (pak: null | Pak) => {
      if (pak == null) {
        localStorage.removeItem('pakrypt.pak[default]')
      } else {
        localStorage.setItem('pakrypt.pak[default]', JSON.stringify(pak))
      }
      setPak(pak)
    },
  }

  return <PakContext.Provider value={value}>
    {children}
  </PakContext.Provider>
}
