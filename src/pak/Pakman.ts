import { Decrypt, DeriveKey, DeriveKeyWithEncrypted, Encrypt, Encrypted, GetEncrypted, PutEncrypted } from '../lib/krypt'
import { NewPak, Pak } from './Pak'

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
  enc: Encrypted,
}
export interface PakmanUnlocked {
  ov: 'pakrypt.pakmanstate:unlocked',
  name: string,
  enc: Encrypted,
  key: CryptoKey,
  pak: Pak,
}

export type PakmanNewResult = (
  | PakmanNewResultSuccess
)
export interface PakmanNewResultSuccess {
  ov: 'pakrypt.pakmannewresult:success',
}

export function ListPaks(): Array<string> {
  const result: Array<string> = []
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i)
    if (key == null) {
      continue
    }
    const m = /pakrypt.pak\[(\w+)\]/.exec(key)
    if (m) {
      result.push(m[1])
    }
  }
  return result
}

export function PakmanClose(): PakmanUnloaded {
  return { ov: 'pakrypt.pakmanstate:unloaded' }
}

export async function PakmanNew(name: string, passphrase: string): Promise<[PakmanUnlocked, PakmanNewResult]> {
  const pak = NewPak()
  const pakData = JSON.stringify(pak)

  const [key, salt] = await DeriveKey(passphrase)
  const enc = await Encrypt(key, salt, new TextEncoder().encode(pakData))

  const pakman: PakmanUnlocked = {
    ov: 'pakrypt.pakmanstate:unlocked',
    name,
    enc,
    key,
    pak,
  }
  const [finalPakman, result] = await PakmanSave(pakman, pak)
  if (result.ov != 'pakrypt.pakmansaveresult:success') {
    throw new Error('Save on new failed: ' + JSON.stringify(result))
  }
  return [finalPakman, { ov: 'pakrypt.pakmannewresult:success' }]
}

export type PakmanLoadResult = (
  | PakmanLoadResultSuccess
  | PakmanLoadResultNotFound
  | PakmanLoadResultCorrupt
)
export interface PakmanLoadResultSuccess {
  ov: 'pakrypt.pakmanloadresult:success',
}
export interface PakmanLoadResultNotFound {
  ov: 'pakrypt.pakmanloadresult:notfound',
}
export interface PakmanLoadResultCorrupt {
  ov: 'pakrypt.pakmanloadresult:corrupt',
}

// Would it be an issue to use UUIDs as the name for these?
// I would need some way to remember the UUID of the last opened file.
export function PakmanLoad(name: string): [Pakman, PakmanLoadResult] {
  const storage = `pakrypt.pak[${name}]`
  const data = localStorage.getItem(storage)
  if (!data) {
    return [
      { ov: 'pakrypt.pakmanstate:unloaded' },
      { ov: 'pakrypt.pakmanloadresult:notfound' },
    ]
  }
  let enc
  try {
    enc = GetEncrypted(data)
  } catch (err) {
    return [
      { ov: 'pakrypt.pakmanstate:unloaded' },
      { ov: 'pakrypt.pakmanloadresult:corrupt' },
    ]
  }
  return [
    {
      ov: 'pakrypt.pakmanstate:loaded',
      name,
      enc,
    },
    { ov: 'pakrypt.pakmanloadresult:success' },
  ]
}

export function PakmanLoadLast(): [Pakman, PakmanLoadResult] {
  const lastPakName = localStorage.getItem('pakrypt.lastpak')
  if (!lastPakName) {
    return [{ 
      ov: 'pakrypt.pakmanstate:unloaded',
    }, {
      ov: 'pakrypt.pakmanloadresult:success',
    }]
  }
  return PakmanLoad(lastPakName)
}

export function PakmanSetLast(name: null | string) {
  if (name == null || name == '') {
    localStorage.removeItem('pakrypt.lastpak')
  } else {
    localStorage.setItem('pakrypt.lastpak', name)
  }
}

export function PakmanDelete(name: string) {
  const lastPakName = localStorage.getItem('pakrypt.lastpak')
  if (lastPakName === name) {
    PakmanSetLast(null)
  }
  const storage = `pakrypt.pak[${name}]`
  localStorage.removeItem(storage)
}

export type PakmanUnlockResult = (
  | PakmanUnlockResultSuccess
  | PakmanUnlockResultDecryptError
  | PakmanUnlockResultDecodeError
  | PakmanUnlockResultIntegrityError
)
export interface PakmanUnlockResultSuccess {
  ov: 'pakrypt.pakmanunlockresult:success',
}
export interface PakmanUnlockResultDecryptError {
  ov: 'pakrypt.pakmanunlockresult:decrypterror',
}
export interface PakmanUnlockResultDecodeError {
  ov: 'pakrypt.pakmanunlockresult:decodeerror',
}
export interface PakmanUnlockResultIntegrityError {
  ov: 'pakrypt.pakmanunlockresult:integrityerror',
}

export async function PakmanUnlock(pakman: PakmanLoaded, passphrase: string): Promise<[Pakman, PakmanUnlockResult]> {
  const key = await DeriveKeyWithEncrypted(passphrase, pakman.enc)

  let buffer
  try {
    buffer = await Decrypt(key, pakman.enc)
  } catch (err) {
    console.error(err)
    return [pakman, {
      ov: 'pakrypt.pakmanunlockresult:decrypterror',
    }]
  }

  let data
  try {
    data = new TextDecoder().decode(buffer)
  } catch (err) {
    console.error(err)
    return [pakman, { ov: 'pakrypt.pakmanunlockresult:decodeerror' }]
  }

  let pak
  try {
    pak = JSON.parse(data) // TODO: Validate the JSON structure maybe.
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakmanunlockresult:integrityerror' }]
    }
    throw err
  }

  return [{
    ov: 'pakrypt.pakmanstate:unlocked',
    name: pakman.name,
    enc: pakman.enc,
    key: key,
    pak: pak,
  }, { ov: 'pakrypt.pakmanunlockresult:success' }]
}

export function PakmanLock(pakman: PakmanUnlocked): PakmanLoaded {
  return {
    ov: 'pakrypt.pakmanstate:loaded',
    name: pakman.name,
    enc: pakman.enc,
  }
}

export type PakmanSaveResult = (
  | PakmanSaveResultSuccess
)
export interface PakmanSaveResultSuccess {
  ov: 'pakrypt.pakmansaveresult:success',
}

export async function PakmanSave(pakman: PakmanUnlocked, pak: Pak): Promise<[PakmanUnlocked, PakmanSaveResult]> {
  const storage = `pakrypt.pak[${pakman.name}]`
  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(pakman.key, pakman.enc.salt, buffer)

  const data = PutEncrypted(enc)
  localStorage.setItem(storage, data)
  
  return [{
    ov: 'pakrypt.pakmanstate:unlocked',
    name: pakman.name,
    enc,
    key: pakman.key,
    pak,
  }, { ov: 'pakrypt.pakmansaveresult:success' }]
}
