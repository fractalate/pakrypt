import { PropsWithChildren, useMemo, useState } from 'react'
import { PakmanStateContext } from './Contexts'
import { Pakman } from './pak/Pakman'
import { CreatePassword, NewPak, Pak } from './pak/Pak'

export default function PakmanStateContextProvider({ children }: PropsWithChildren) {
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

  // TODO: This should load from localStorge.
  const initialPakman = useMemo(() => {
    return {
      ov: 'pakrypt.pakmanstate:unlocked',
      name: 'default',
      data: JSON.stringify(initialPak),
      key: '',
      pak: initialPak,
    } as Pakman
  }, [initialPak])

  const [pakman, setPakman] = useState(initialPakman)

  return <PakmanStateContext.Provider value={{ pakman, setPakman }}>
    { children }
  </PakmanStateContext.Provider>
}
