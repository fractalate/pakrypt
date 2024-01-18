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
  local: null | PakmanLocalLoaded, // XXX - I think I want to flatten these into the pakman.
}
export interface PakmanUnlocked {
  ov: 'pakrypt.pakman_state:unlocked',
  name: string,
  enc: Encrypted,
  local: null | PakmanLocal,
  key: CryptoKey,
  pak: Pak,
}

interface PakmanLocalStorageItem {
  ov: 'pakman.pakman_local_storage_item:1.0',
  pak?: string,
  local?: string,
}

export interface PakmanLocalLoaded {
  enc: Encrypted,
}
export interface PakmanLocal {
  enc: Encrypted,
  options: PakmanLocalOptions,
}
export interface PakmanLocalOptions {
  ov: 'pakrypt.pakman_local_options:1.0',
  pakmanStore: null | PakmanLocalOptionsPakmanStore,
}
export interface PakmanLocalOptionsPakmanStore {
  ov: 'pakrypt.pakman_local_options.pakman_store:1.0',
  url: string,
  key: string,
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
    local: null,
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

function PakmanLoadRaw(name: string): null | string {
  const storage = `pakrypt.pak[${name}]`
  const data = localStorage.getItem(storage)
  return data
}

function PakmanLoadRawLocal(name: string): null | string {
  const storage = `pakrypt.pak[${name}].local`
  const data = localStorage.getItem(storage)
  return data
}

function PakmanSaveRaw(name: string, data: null | string) {
  const storage = `pakrypt.pak[${name}]`
  if (data == null || data == '') {
    localStorage.removeItem(storage)
  } else {
    localStorage.setItem(storage, data)
  }
}

function PakmanSaveRawLocal(name: string, data: null | string) {
  const storage = `pakrypt.pak[${name}].local`
  if (data == null || data == '') {
    localStorage.removeItem(storage)
  } else {
    localStorage.setItem(storage, data)
  }
}

function PakmanImport(name: string, pakData: string) {

}

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
  const localData = PakmanLoadRawLocal(name)
  let local: null | PakmanLocalLoaded = null
  if (localData) {
    local = {
      enc: GetEncrypted(localData),
    }
  }
  return [
    {
      ov: 'pakrypt.pakman_state:loaded',
      name,
      enc,
      local,
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
  PakmanSaveRaw(name, null)
  PakmanSaveRawLocal(name, null)
}

type DecryptTextEncResult = (
  | DecryptTextEncResultSuccess
  | DecryptTextEncResultDecryptError
  | DecryptTextEncResultDecodeError
)
interface DecryptTextEncResultSuccess {
  ov: 'pakrypt.decrypt_text_enc_result:success',
}
interface DecryptTextEncResultDecryptError {
  ov: 'pakrypt.decrypt_text_enc_result:decrypt_error',
}
interface DecryptTextEncResultDecodeError {
  ov: 'pakrypt.decrypt_text_enc_result:decode_error',
}
async function DecryptTextEnc(passphrase: string, enc: Encrypted): Promise<[string, DecryptTextEncResult]> {
  const key = await DeriveKeyWithEncrypted(passphrase, enc)

  let buffer
  try {
    buffer = await Decrypt(key, enc)
  } catch (err) {
    console.error(err)
    return ['', {
      ov: 'pakrypt.decrypt_text_enc_result:decrypt_error',
    }]
  }

  let data
  try {
    data = new TextDecoder().decode(buffer)
  } catch (err) {
    console.error(err)
    return ['', { ov: 'pakrypt.decrypt_text_enc_result:decode_error' }]
  }

  return [data, { ov: 'pakrypt.decrypt_text_enc_result:success' }]
}

export type PakmanUnlockResult = (
  | PakmanUnlockResultSuccess
  | PakmanUnlockResultDecryptError
  | PakmanUnlockResultDecodeError
  | PakmanUnlockResultIntegrityError
  | PakmanUnlockResultLocalDecryptError
  | PakmanUnlockResultLocalDecodeError
  | PakmanUnlockResultLocalIntegrityError
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
export interface PakmanUnlockResultLocalDecryptError {
  ov: 'pakrypt.pakman_unlock_result:local_decrypt_error',
}
export interface PakmanUnlockResultLocalDecodeError {
  ov: 'pakrypt.pakman_unlock_result:local_decode_error',
}
export interface PakmanUnlockResultLocalIntegrityError {
  ov: 'pakrypt.pakman_unlock_result:local_integrity_error',
}

export async function PakmanUnlock(pakman: PakmanLoaded, passphrase: string): Promise<[Pakman, PakmanUnlockResult]> {
  const [data, decryptResult] = await DecryptTextEnc(passphrase, pakman.enc)

  if (decryptResult.ov !== 'pakrypt.decrypt_text_enc_result:success') {
    if (decryptResult.ov === 'pakrypt.decrypt_text_enc_result:decrypt_error') {
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:decrypt_error' }]
    } else if (decryptResult.ov === 'pakrypt.decrypt_text_enc_result:decode_error') {
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:decode_error' }]
    }
    return decryptResult // never
  }

  const [key, salt] = await DeriveKey(passphrase)

  let local: null | PakmanLocal = null
  if (pakman.local != null) {
    const [localOptionsData, localOptionsDecryptResult] = await DecryptTextEnc(passphrase, pakman.local.enc)

    if (localOptionsDecryptResult.ov !== 'pakrypt.decrypt_text_enc_result:success') {
      if (localOptionsDecryptResult.ov === 'pakrypt.decrypt_text_enc_result:decrypt_error') {
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_decrypt_error' }]
      } else if (localOptionsDecryptResult.ov === 'pakrypt.decrypt_text_enc_result:decode_error') {
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_decode_error' }]
      }
      return localOptionsDecryptResult // never
    }

    try {
      const buffer = new TextEncoder().encode(JSON.stringify(localOptionsData))
      const enc = await Encrypt(key, salt, buffer)
      local = {
        enc,
        options: JSON.parse(localOptionsData),  // TODO: Validate the JSON structure maybe.
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(err)
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_integrity_error' }]
      }
      throw err
    }
  }

  let pak: Pak
  try {
    pak = JSON.parse(data) // TODO: Validate the JSON structure maybe.
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:integrity_error' }]
    }
    throw err
  }

  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(key, salt, buffer)

  return [{
    ov: 'pakrypt.pakman_state:unlocked',
    name: pakman.name,
    enc,
    local,
    key,
    pak,
  }, { ov: 'pakrypt.pakman_unlock_result:success' }]
}

export function PakmanLock(pakman: PakmanUnlocked): PakmanLoaded {
  let local: null | PakmanLocalLoaded = null
  if (pakman.local != null) {
    local = {
      enc: pakman.local.enc,
    }
  }
  return {
    ov: 'pakrypt.pakman_state:loaded',
    name: pakman.name,
    enc: pakman.enc,
    local,
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
  let local: null | PakmanLocal = null
  if (pakman.local != null) {
    const buffer = new TextEncoder().encode(JSON.stringify(pakman.local.options))
    const enc = await Encrypt(pakman.key, pakman.local.enc.salt, buffer)
    local = {
      enc,
      options: pakman.local.options,
    }
  }
  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(pakman.key, pakman.enc.salt, buffer)
  const [newPakman, result] = await PakmanSave({ ...pakman, pak, enc, local })
  if (result.ov !== 'pakrypt.pakman_save_result:success') {
    return [pakman, result]
  }
  return [newPakman, result]
}

export async function PakmanUpdateLocalOptions(pakman: PakmanUnlocked, options: null | PakmanLocalOptions): Promise<[PakmanUnlocked, PakmanSaveResult]> {
  let local: null | PakmanLocal = null
  if (options != null) {
    const buffer = new TextEncoder().encode(JSON.stringify(options))
    const enc = await Encrypt(pakman.key, pakman.enc.salt, buffer)
    local = {
      enc,
      options,
    }
  }
  const [newPakman, result] = await PakmanSave({ ...pakman, local })
  if (result.ov !== 'pakrypt.pakman_save_result:success') {
    return [pakman, result]
  }
  return [newPakman, result]
}

export async function PakmanChangePassphrase(pakman: PakmanUnlocked, passphrase: string): Promise<[PakmanUnlocked, PakmanSaveResult]> {
  let local: null | PakmanLocal = null
  if (pakman.local != null) {
    const buffer = new TextEncoder().encode(JSON.stringify(pakman.local.options))
    const enc = await Encrypt(pakman.key, pakman.local.enc.salt, buffer)
    local = {
      enc,
      options: pakman.local.options,
    }
  }
  const [key, salt] = await DeriveKey(passphrase)
  const buffer = new TextEncoder().encode(JSON.stringify(pakman.pak))
  const enc = await Encrypt(key, salt, buffer)
  const [newPakman, result] = await PakmanSave({ ...pakman, key, enc, local })
  if (result.ov !== 'pakrypt.pakman_save_result:success') {
    return [pakman, result]
  }
  return [newPakman, result]
}

export async function PakmanCopy<T extends PakmanLoaded | PakmanUnlocked>(pakman: T, name: string): Promise<[T, PakmanSaveResult]> {
  const [newPakman, result] = await PakmanSave({ ...pakman, name, local: null })
  if (result.ov !== 'pakrypt.pakman_save_result:success') {
    return [pakman, result]
  }
  return [newPakman, result]
}

// Use the PakmanChangePassphrase(), PakmanUpdate(), and PakmanCopy() functions.
async function PakmanSave<T extends PakmanLoaded | PakmanUnlocked>(pakman: T): Promise<[T,  PakmanSaveResult]> {
  const [newPakman, storeResult] = await PakmanStore(pakman)

  if (storeResult.ov === 'pakrypt.pakman_store_result:success') {
    return [newPakman, { ov: 'pakrypt.pakman_save_result:success' }]
  } else if (storeResult.ov === 'pakrypt.pakman_store_result:fail') {
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

  const data = PutEncrypted(enc)
  PakmanSaveRaw(pakman.name, data)

  if (pakman.local == null) {
    PakmanSaveRawLocal(pakman.name, null)
  } else {
    const localData = PutEncrypted(pakman.local.enc)
    PakmanSaveRawLocal(pakman.name, localData)
  }

  return [pakman, { ov: 'pakrypt.pakman_store_result:success' }]
}
