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
  ov: 'pakrypt.pakman_state:unloaded',
}
export interface PakmanLoaded {
  ov: 'pakrypt.pakman_state:loaded',
  name: string,
  enc: Encrypted,
}
export interface PakmanUnlocked {
  ov: 'pakrypt.pakman_state:unlocked',
  name: string,
  enc: Encrypted,
  key: CryptoKey,
  pak: Pak,
}

export type PakmanNewResult = (
  | PakmanNewResultSuccess
  | PakmanNewResultStoreFailed
)
export interface PakmanNewResultSuccess {
  ov: 'pakrypt.pakman_new_result:success',
}
export interface PakmanNewResultStoreFailed {
  ov: 'pakrypt.pakman_new_result:store_failed',
  cause: PakmanStoreResult,
}

export function ListPaks(): Array<string> {
  const result: Array<string> = []
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i)
    if (key == null) {
      continue
    }
    const m = /^pakrypt.pak\[(.+)\]$/.exec(key)
    if (m) {
      result.push(m[1])
    }
  }
  return result
}

export function PakmanClose(): PakmanUnloaded {
  return { ov: 'pakrypt.pakman_state:unloaded' }
}

export async function PakmanNew(name: string, passphrase: string): Promise<[PakmanUnlocked, PakmanNewResult]> {
  const pak = NewPak()

  const [key, salt] = await DeriveKey(passphrase)

  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(key, salt, buffer)

  const pakman: PakmanUnlocked = {
    ov: 'pakrypt.pakman_state:unlocked',
    name,
    enc,
    key,
    pak,
  }

  const [finalPakman, result] = await PakmanStore(pakman)

  if (result.ov === 'pakrypt.pakman_store_result:success') {
    return [finalPakman, { ov: 'pakrypt.pakman_new_result:success' }]
  } else if (result.ov === 'pakrypt.pakman_store_result:fail') {
    return [pakman, { ov: 'pakrypt.pakman_new_result:store_failed', cause: result }]
  }

  return result // never
}

export type PakmanLoadResult = (
  | PakmanLoadResultSuccess
  | PakmanLoadResultNotFound
  | PakmanLoadResultCorrupt
)
export interface PakmanLoadResultSuccess {
  ov: 'pakrypt.pakman_load_result:success',
}
export interface PakmanLoadResultNotFound {
  ov: 'pakrypt.pakman_load_result:notfound',
}
export interface PakmanLoadResultCorrupt {
  ov: 'pakrypt.pakman_load_result:corrupt',
}

export function PakmanLoadRaw(name: string): null | string {
  const storage = `pakrypt.pak[${name}]`
  const data = localStorage.getItem(storage)
  return data
}

export function PakmanSaveRaw(name: string, data: string) {
  const storage = `pakrypt.pak[${name}]`
  localStorage.setItem(storage, data)
}

// Would it be an issue to use UUIDs as the name for these?
// I would need some way to remember the UUID of the last opened file.
export function PakmanLoad(name: string): [Pakman, PakmanLoadResult] {
  const data = PakmanLoadRaw(name)
  if (!data) {
    return [
      { ov: 'pakrypt.pakman_state:unloaded' },
      { ov: 'pakrypt.pakman_load_result:notfound' },
    ]
  }
  let enc
  try {
    enc = GetEncrypted(data)
  } catch (err) {
    return [
      { ov: 'pakrypt.pakman_state:unloaded' },
      { ov: 'pakrypt.pakman_load_result:corrupt' },
    ]
  }
  return [
    {
      ov: 'pakrypt.pakman_state:loaded',
      name,
      enc,
    },
    { ov: 'pakrypt.pakman_load_result:success' },
  ]
}

export function PakmanLoadLast(): [Pakman, PakmanLoadResult] {
  const lastPakName = localStorage.getItem('pakrypt.last_pak')
  if (!lastPakName) {
    return [{ 
      ov: 'pakrypt.pakman_state:unloaded',
    }, {
      ov: 'pakrypt.pakman_load_result:success',
    }]
  }
  return PakmanLoad(lastPakName)
}

export function PakmanSetLast(name: null | string) {
  if (name == null || name == '') {
    localStorage.removeItem('pakrypt.last_pak')
  } else {
    localStorage.setItem('pakrypt.last_pak', name)
  }
}

export function PakmanDelete(name: string) {
  const lastPakName = localStorage.getItem('pakrypt.last_pak')
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
  ov: 'pakrypt.pakman_unlock_result:success',
}
export interface PakmanUnlockResultDecryptError {
  ov: 'pakrypt.pakman_unlock_result:decrypt_error',
}
export interface PakmanUnlockResultDecodeError {
  ov: 'pakrypt.pakman_unlock_result:decode_error',
}
export interface PakmanUnlockResultIntegrityError {
  ov: 'pakrypt.pakman_unlock_result:integrity_error',
}

export async function PakmanUnlock(pakman: PakmanLoaded, passphrase: string): Promise<[Pakman, PakmanUnlockResult]> {
  let key = await DeriveKeyWithEncrypted(passphrase, pakman.enc)

  let buffer
  try {
    buffer = await Decrypt(key, pakman.enc)
  } catch (err) {
    console.error(err)
    return [pakman, {
      ov: 'pakrypt.pakman_unlock_result:decrypt_error',
    }]
  }

  let data
  try {
    data = new TextDecoder().decode(buffer)
  } catch (err) {
    console.error(err)
    return [pakman, { ov: 'pakrypt.pakman_unlock_result:decode_error' }]
  }

  let pak
  try {
    pak = JSON.parse(data) // TODO: Validate the JSON structure maybe.
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:integrity_error' }]
    }
    throw err
  }

  const [newKey, salt] = await DeriveKey(passphrase)
  key = newKey
  buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(newKey, salt, buffer)

  return [{
    ov: 'pakrypt.pakman_state:unlocked',
    name: pakman.name,
    enc: enc,
    key: key,
    pak: pak,
  }, { ov: 'pakrypt.pakman_unlock_result:success' }]
}

export function PakmanLock(pakman: PakmanUnlocked): PakmanLoaded {
  return {
    ov: 'pakrypt.pakman_state:loaded',
    name: pakman.name,
    enc: pakman.enc,
  }
}

export type PakmanSaveResult = (
  | PakmanSaveResultSuccess
  | PakmanSaveResultStoreFailed
)
export interface PakmanSaveResultSuccess {
  ov: 'pakrypt.pakman_save_result:success',
}
export interface PakmanSaveResultStoreFailed {
  ov: 'pakrypt.pakman_save_result:store_failed',
  cause: PakmanStoreResultFail,
}

export async function PakmanUpdate(pakman: PakmanUnlocked, pak: Pak): Promise<[PakmanUnlocked, PakmanSaveResult]> {
  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(pakman.key, pakman.enc.salt, buffer)
  return PakmanSave({ ...pakman, pak, enc })
}

export async function PakmanChangePassphrase(pakman: PakmanUnlocked, passphrase: string): Promise<[PakmanUnlocked, PakmanSaveResult]> {
  const [key, salt] = await DeriveKey(passphrase)
  const buffer = new TextEncoder().encode(JSON.stringify(pakman.pak))
  const enc = await Encrypt(key, salt, buffer)
  return PakmanSave({ ...pakman, key, enc })
}

export async function PakmanRename<T extends PakmanLoaded | PakmanUnlocked>(pakman: T, name: string): Promise<[T, PakmanSaveResult]> {
  return await PakmanSave({ ...pakman, name })
}

// Use the PakmanChangePassphrase, PakmanUpdate, and PakmanRename functions.
async function PakmanSave<T extends PakmanLoaded | PakmanUnlocked>(pakman: T): Promise<[T,  PakmanSaveResult]> {
  const [newPakman, storeResult] = await PakmanStore(pakman)

  if (storeResult.ov == 'pakrypt.pakman_store_result:success') {
    return [newPakman, { ov: 'pakrypt.pakman_save_result:success' }]
  } else if (storeResult.ov == 'pakrypt.pakman_store_result:fail') {
    return [pakman, { ov: 'pakrypt.pakman_save_result:store_failed', cause: storeResult }]
  }

  return storeResult // never
}

type PakmanStoreResult = (
  | PakmanStoreResultSuccess
  | PakmanStoreResultFail
)
interface PakmanStoreResultSuccess {
  ov: 'pakrypt.pakman_store_result:success',
}
interface PakmanStoreResultFail {
  ov: 'pakrypt.pakman_store_result:fail',
}

async function PakmanStore<T extends PakmanLoaded | PakmanUnlocked>(pakman: T): Promise<[T, PakmanStoreResult]> {
  const enc = pakman.enc

  const storage = `pakrypt.pak[${pakman.name}]`
  const data = PutEncrypted(enc)
  localStorage.setItem(storage, data)

  return [pakman, { ov: 'pakrypt.pakman_store_result:success' }]
}
