import { Pak } from './Pak'

export interface PakmanStateContextState {
  pakman: Pakman,
  setPakman: (pakman: Pakman) => void,
}

export type Pakman = (
  | PakmanUnloaded
  | PakmanLoaded
  | PakmanUnlocked
)
export interface PakmanUnloaded {
  ov: 'pakrypt.pakmanstate:unloaded',
}
export interface PakmanLoaded {
  ov: 'pakrypt.pakmanstate:loaded',
  name: string,
  data: string,
}
export interface PakmanUnlocked {
  ov: 'pakrypt.pakmanstate:unlocked',
  name: string,
  data: string,
  key: CryptoKey,
  pak: Pak,
}

export type PakmanLoadResult = (
  | PakmanLoadResultSuccess
  | PakmanLoadResultNotFound
)
export interface PakmanLoadResultSuccess {
  ov: 'pakrypt.pakmanloadresult:success',
}
export interface PakmanLoadResultNotFound {
  ov: 'pakrypt.pakmanloadresult:notfound',
}

// Would it be an issue to use UUIDs as the name for these?
// I would need some way to remember the UUID of the last opened file.
export function PakmanLoad(name: string): [Pakman, PakmanLoadResult] {
  const key = `pakrypt.pak[${name}]`
  const data = localStorage.getItem(key)
  if (!data) {
    return [
      { ov: 'pakrypt.pakmanstate:unloaded' },
      { ov: 'pakrypt.pakmanloadresult:notfound' },
    ]
  }
  return [
    {
      ov: 'pakrypt.pakmanstate:loaded',
      name,
      data,
    },
    { ov: 'pakrypt.pakmanloadresult:success' },
  ]
}

export function PakmanLoadDefault(): [Pakman, PakmanLoadResult] {
  return PakmanLoad('default')
}

export type PakmanUnlockResult = (
  | PakmanUnlockResultSuccess
  | PakmanUnlockResultDecryptError
  | PakmanUnlockResultIntegrityError
)
export interface PakmanUnlockResultSuccess {
  ov: 'pakrypt.pakmanunlockresult:success',
}
export interface PakmanUnlockResultDecryptError {
  ov: 'pakrypt.pakmanunlockresult:decrypterror',
}
export interface PakmanUnlockResultIntegrityError {
  ov: 'pakrypt.pakmanunlockresult:integrityerror',
}

export function PakmanUnlock(pakman: PakmanLoaded): [Pakman, PakmanUnlockResult] {
  // TODO: Do decryption!

  try {
    const pak = JSON.parse(pakman.data)
    return [{
      ov: 'pakrypt.pakmanstate:unlocked',
      name: pakman.name,
      data: pakman.data,
      key: null as unknown as CryptoKey, // TODO: Not right.
      pak: pak,
    }, { ov: 'pakrypt.pakmanunlockresult:success' }]
  } catch (err) {
    if (err instanceof SyntaxError) {
      return [pakman, { ov: 'pakrypt.pakmanunlockresult:integrityerror' }]
    }
    throw err
  }
}

export type PakmanSaveResult = (
  | PakmanSaveResultSuccess
)
export interface PakmanSaveResultSuccess {
  ov: 'pakrypt.pakmansaveresult:success',
}

export function PakmanSave(pakman: PakmanUnlocked, pak: Pak): [Pakman, PakmanSaveResult] {
  // TODO: Do encryption!

  const key = `pakrypt.pak[${pakman.name}]`
  const data = JSON.stringify(pak)
  localStorage.setItem(key, data)

  return [{
    ov: 'pakrypt.pakmanstate:unlocked',
    name: pakman.name,
    data,
    key: pakman.key,
    pak,
}, { ov: 'pakrypt.pakmansaveresult:success' }]
}
