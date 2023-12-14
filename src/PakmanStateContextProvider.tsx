import { PropsWithChildren, useMemo, useState } from 'react'
import { PakmanStateContext } from './Contexts'
import { Pakman } from './pak/Pakman'

export default function PakmanStateContextProvider({ children }: PropsWithChildren) {
  const pakData = useMemo(() => {
    for (const key of Object.keys(localStorage)) {
      // "pakrypt.pak[default]"
      if (/^pakrypt.pak\[\w+\]$/.test(key)) {
        const pakData = localStorage.getItem(key)
        if (pakData == null) {
          continue
        }
        return pakData
      }
    }
    return null
  }, [])

  /*
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
  }, [pakData])
  */

  // TODO: This should load from localStorge.
  const initialPakman = useMemo((): Pakman => {
    if (pakData == null) {
      return {
        ov: 'pakrypt.pakmanstate:unloaded',
      }
    }
    return {
      ov: 'pakrypt.pakmanstate:loaded',
      name: 'default',
      data: pakData,
    } as Pakman
  }, [pakData])

  const [pakman, setPakman] = useState(initialPakman)

  return <PakmanStateContext.Provider value={{ pakman, setPakman }}>
    { children }
  </PakmanStateContext.Provider>
}
