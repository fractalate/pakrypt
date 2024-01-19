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
  ov: 'pakrypt.pakman_local_storage_item:1.0',
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
  } else if (result.ov === 'pakrypt.pakman_store_result:no_space') {
    return [pakman, { ov: 'pakrypt.pakman_new_result:store_failed', cause: result }]
  } else if (result.ov === 'pakrypt.pakman_store_result:pakrypt_store_failed') {
    return [pakman, { ov: 'pakrypt.pakman_new_result:store_failed', cause: result }]
  }

  return result // never
}

type PakmanLoadLocalStorageItemResult = (
  | PakmanLoadLocalStorageItemResultSuccess
  | PakmanLoadLocalStorageItemResultNotFound
  | PakmanLoadLocalStorageItemResultIntegrityError
)
interface PakmanLoadLocalStorageItemResultSuccess {
  ov: 'pakrypt.pakman_load_local_storage_item_result:success',
}
interface PakmanLoadLocalStorageItemResultNotFound {
  ov: 'pakrypt.pakman_load_local_storage_item_result:not_found',
}
interface PakmanLoadLocalStorageItemResultIntegrityError {
  ov: 'pakrypt.pakman_load_local_storage_item_result:integrity_error',
}

function PakmanLoadLocalStorageItem(name: string): [PakmanLocalStorageItem, PakmanLoadLocalStorageItemResult] {
  const storage = `pakrypt.pak[${name}]`
  const raw = localStorage.getItem(storage)
  if (raw == null || raw == '') {
    return [{ ov: 'pakrypt.pakman_local_storage_item:1.0' }, { ov: 'pakrypt.pakman_load_local_storage_item_result:not_found' }]
  }

  let result: PakmanLocalStorageItem
  try {
    result = JSON.parse(raw)
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
      return [{ ov: 'pakrypt.pakman_local_storage_item:1.0' }, { ov: 'pakrypt.pakman_load_local_storage_item_result:integrity_error' }]
    }
    throw err
  }

  if (result.ov !== 'pakrypt.pakman_local_storage_item:1.0') {
    return [{ ov: 'pakrypt.pakman_local_storage_item:1.0' }, { ov: 'pakrypt.pakman_load_local_storage_item_result:integrity_error' }]
  }

  return [result, { ov: 'pakrypt.pakman_load_local_storage_item_result:success' }]
}

type PakmanSaveLocalStorageItemResult = (
  | PakmanSaveLocalStorageItemResultSuccess
  | PakmanSaveLocalStorageItemResultNoSpace
)
interface PakmanSaveLocalStorageItemResultSuccess {
  ov: 'pakrypt.pakman_save_local_storage_item_result:success',
}
interface PakmanSaveLocalStorageItemResultNoSpace {
  ov: 'pakrypt.pakman_save_local_storage_item_result:no_space',
}

function PakmanSaveLocalStorageItem(name: string, item: PakmanLocalStorageItem): PakmanSaveLocalStorageItemResult {
  const storage = `pakrypt.pak[${name}]`
  const raw = JSON.stringify(item)
  try {
    localStorage.setItem(storage, raw)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.error(err)
      return { ov: 'pakrypt.pakman_save_local_storage_item_result:no_space' }
    }
    throw err
  }
  return { ov: 'pakrypt.pakman_save_local_storage_item_result:success' }
}

function PakmanRemoveLocalStorageItem(name: string) {
  const storage = `pakrypt.pak[${name}]`
  localStorage.removeItem(storage)
}

type PakmanImportResult = (
  | PakmanImportResultSuccess
  | PakmanImportResultNoSpace
)
interface PakmanImportResultSuccess {
  ov: 'pakrypt.pakman_import_result:success',
}
interface PakmanImportResultNoSpace {
  ov: 'pakrypt.pakman_import_result:no_space',
}
export function PakmanImport(name: string, pak: string): PakmanImportResult {
  const item: PakmanLocalStorageItem = {
    ov: 'pakrypt.pakman_local_storage_item:1.0',
    pak,
  }

  const result = PakmanSaveLocalStorageItem(name, item)
  if (result.ov !== 'pakrypt.pakman_save_local_storage_item_result:success') {
    if (result.ov === 'pakrypt.pakman_save_local_storage_item_result:no_space') {
      return { ov: 'pakrypt.pakman_import_result:no_space' }
    }

    return result // never
  }

  return { ov: 'pakrypt.pakman_import_result:success' }
}

type PakmanExportResult = (
  | PakmanExportResultSuccess
  | PakmanExportResultNotFound
  | PakmanExportResultIntegrityError
)
interface PakmanExportResultSuccess {
  ov: 'pakrypt.pakman_export_result:success',
}
interface PakmanExportResultNotFound {
  ov: 'pakrypt.pakman_export_result:not_found',
}
interface PakmanExportResultIntegrityError {
  ov: 'pakrypt.pakman_export_result:integrity_error',
  detail: (
    | 'pakrypt.pakman_load_local_storage_item_result:integrity_error'
    | 'pak_local_storage_item_integrity_error'
  ),
}

export function PakmanExport(name: string): [string, PakmanExportResult] {
  const [item, itemResult] = PakmanLoadLocalStorageItem(name)

  if (itemResult.ov !== 'pakrypt.pakman_load_local_storage_item_result:success') {
    if (itemResult.ov === 'pakrypt.pakman_load_local_storage_item_result:not_found') {
      return ['', { ov: 'pakrypt.pakman_export_result:not_found' }]
    } else if (itemResult.ov === 'pakrypt.pakman_load_local_storage_item_result:integrity_error') {
      return ['', { ov: 'pakrypt.pakman_export_result:integrity_error', detail: itemResult.ov }]
    }

    return itemResult // never
  }

  if (item.pak == null || item.pak == '') {
    return ['', { ov: 'pakrypt.pakman_export_result:integrity_error', detail: 'pak_local_storage_item_integrity_error' }]
  }

  return [item.pak, { ov: 'pakrypt.pakman_export_result:success' }]
}

export type PakmanLoadResult = (
  | PakmanLoadResultSuccess
  | PakmanLoadResultNotFound
  | PakmanLoadResultIntegrityError
)
export interface PakmanLoadResultSuccess {
  ov: 'pakrypt.pakman_load_result:success',
}
export interface PakmanLoadResultNotFound {
  ov: 'pakrypt.pakman_load_result:not_found',
}
export interface PakmanLoadResultIntegrityError {
  ov: 'pakrypt.pakman_load_result:integrity_error',
  detail: (
    | 'pakrypt.pakman_load_local_storage_item_result:integrity_error'
    | 'pak_local_storage_item_integrity_error'
    | 'pak_integrity_error'
    | 'local_integrity_error'
  ),
}

export function PakmanLoad(name: string): [Pakman, PakmanLoadResult] {
  const [item, itemResult] = PakmanLoadLocalStorageItem(name)

  if (itemResult.ov !== 'pakrypt.pakman_load_local_storage_item_result:success') {
    if (itemResult.ov === 'pakrypt.pakman_load_local_storage_item_result:not_found') {
      return [{ ov: 'pakrypt.pakman_state:unloaded' }, { ov: 'pakrypt.pakman_load_result:not_found' }]
    } else if (itemResult.ov === 'pakrypt.pakman_load_local_storage_item_result:integrity_error') {
      return [{ ov: 'pakrypt.pakman_state:unloaded' }, { ov: 'pakrypt.pakman_load_result:integrity_error', detail: itemResult.ov }]
    }

    return itemResult // never
  }

  const data = item.pak
  if (data == null || data == '') {
    return [{ ov: 'pakrypt.pakman_state:unloaded' }, { ov: 'pakrypt.pakman_load_result:integrity_error', detail: 'pak_local_storage_item_integrity_error' }]
  }

  let enc: Encrypted
  try {
    enc = GetEncrypted(data)
  } catch (err) {
    console.error(err)
    return [{ ov: 'pakrypt.pakman_state:unloaded' }, { ov: 'pakrypt.pakman_load_result:integrity_error', detail: 'pak_integrity_error' }]
  }

  const localData = item.local
  let local: null | PakmanLocalLoaded = null
  if (localData) {
    try {
      local = {
        enc: GetEncrypted(localData),
      }
    } catch (err) {
      console.error(err)
      return [{ ov: 'pakrypt.pakman_state:unloaded' }, { ov: 'pakrypt.pakman_load_result:integrity_error', detail: 'local_integrity_error' }]
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
  PakmanRemoveLocalStorageItem(name)
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
  | PakmanUnlockResultFetchError
  | PakmanUnlockResultRekeyError
  | PakmanUnlockResultLocalDecryptError
  | PakmanUnlockResultLocalDecodeError
  | PakmanUnlockResultLocalIntegrityError
  | PakmanUnlockResultLocalRekeyError
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
  detail: 'parse' | 'validate',
}
export interface PakmanUnlockResultFetchError {
  ov: 'pakrypt.pakman_unlock_result:pakrypt_store_load_error',
}
export interface PakmanUnlockResultRekeyError {
  ov: 'pakrypt.pakman_unlock_result:rekey_error',
  detail: 'derive_key' | 'encrypt',
}
export interface PakmanUnlockResultLocalDecryptError {
  ov: 'pakrypt.pakman_unlock_result:local_decrypt_error',
}
export interface PakmanUnlockResultLocalDecodeError {
  ov: 'pakrypt.pakman_unlock_result:local_decode_error',
}
export interface PakmanUnlockResultLocalIntegrityError {
  ov: 'pakrypt.pakman_unlock_result:local_integrity_error',
  detail: 'parse' | 'validate',
}
export interface PakmanUnlockResultLocalRekeyError {
  ov: 'pakrypt.pakman_unlock_result:local_rekey_error',
  detail: 'encrypt',
}

export async function PakmanUnlock(pakman: PakmanLoaded, passphrase: string): Promise<[Pakman, PakmanUnlockResult]> {
  let key: CryptoKey
  let salt: Uint8Array
  try {
    [key, salt] = await DeriveKey(passphrase)
  } catch (err) {
    console.error(err)
    return [pakman, { ov: 'pakrypt.pakman_unlock_result:rekey_error', detail: 'derive_key' }]
  }

  let local: null | PakmanLocal = null
  if (pakman.local != null) {
    const [localOptionsData, localOptionsDecryptResult] = await DecryptTextEnc(passphrase, pakman.local.enc)

    let options: PakmanLocalOptions
    try {
      options = JSON.parse(localOptionsData)
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(err)
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_integrity_error', detail: 'parse' }]
      }
      throw err
    }

    // TODO: Validate the JSON structure fully.
    if (options.ov !== 'pakrypt.pakman_local_options:1.0') {
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_integrity_error', detail: 'validate' }]
    }

    if (localOptionsDecryptResult.ov !== 'pakrypt.decrypt_text_enc_result:success') {
      if (localOptionsDecryptResult.ov === 'pakrypt.decrypt_text_enc_result:decrypt_error') {
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_decrypt_error' }]
      } else if (localOptionsDecryptResult.ov === 'pakrypt.decrypt_text_enc_result:decode_error') {
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_decode_error' }]
      }
      return localOptionsDecryptResult // never
    }

    const buffer = new TextEncoder().encode(localOptionsData)
    let enc: Encrypted
    try {
      enc = await Encrypt(key, salt, buffer)
    } catch (err) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:local_rekey_error', detail: 'encrypt' }]
    }

    local = {
      enc,
      options,
    }
  }

  let enc0: Encrypted
  if (local != null && local.options.pakmanStore != null) {
    try {
      const result = await fetch(local.options.pakmanStore.url, {
        method: 'GET',
        headers: {
          'X-Api-Key': local.options.pakmanStore.key,
        },
      })
      const o = await result.json()
      if (o.success !== true) {
        return [pakman, { ov: 'pakrypt.pakman_unlock_result:pakrypt_store_load_error' }]
      }
      enc0 = GetEncrypted(o.data)
    } catch (err) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:pakrypt_store_load_error' }]
    }
  } else {
    enc0 = pakman.enc
  }

  const [data, decryptResult] = await DecryptTextEnc(passphrase, enc0)

  if (decryptResult.ov !== 'pakrypt.decrypt_text_enc_result:success') {
    if (decryptResult.ov === 'pakrypt.decrypt_text_enc_result:decrypt_error') {
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:decrypt_error' }]
    } else if (decryptResult.ov === 'pakrypt.decrypt_text_enc_result:decode_error') {
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:decode_error' }]
    }
    return decryptResult // never
  }

  let pak: Pak
  try {
    pak = JSON.parse(data)
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
      return [pakman, { ov: 'pakrypt.pakman_unlock_result:integrity_error', detail: 'parse' }]
    }
    throw err
  }

  // TODO: Validate the JSON structure fully.
  if (pak.ov !== 'pakrypt.pak:1.0') {
    return [pakman, { ov: 'pakrypt.pakman_unlock_result:integrity_error', detail: 'validate' }]
  }

  const buffer = new TextEncoder().encode(data)
  let enc: Encrypted
  try {
    enc = await Encrypt(key, salt, buffer)
  } catch (err) {
    console.error(err)
    return [pakman, { ov: 'pakrypt.pakman_unlock_result:rekey_error', detail: 'encrypt' }]
  }

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
  cause: PakmanStoreResult,
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
  const [key, salt] = await DeriveKey(passphrase)
  let local: null | PakmanLocal = null
  if (pakman.local != null) {
    const buffer = new TextEncoder().encode(JSON.stringify(pakman.local.options))
    const enc = await Encrypt(key, salt, buffer)
    local = {
      enc,
      options: pakman.local.options,
    }
  }
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

  if (storeResult.ov !== 'pakrypt.pakman_store_result:success') {
    if (storeResult.ov === 'pakrypt.pakman_store_result:no_space') {
      return [pakman, { ov: 'pakrypt.pakman_save_result:store_failed', cause: storeResult }]
    } else if (storeResult.ov === 'pakrypt.pakman_store_result:pakrypt_store_failed') {
      return [pakman, { ov: 'pakrypt.pakman_save_result:store_failed', cause: storeResult }]
    }

    return storeResult // never
  }

  return [newPakman, { ov: 'pakrypt.pakman_save_result:success' }]
}

type PakmanStoreResult = (
  | PakmanStoreResultSuccess
  | PakmanStoreResultNoSpace
  | PakmanStoreResultPakmanStoreFailed
)
interface PakmanStoreResultSuccess {
  ov: 'pakrypt.pakman_store_result:success',
}
interface PakmanStoreResultNoSpace {
  ov: 'pakrypt.pakman_store_result:no_space',
}
interface PakmanStoreResultPakmanStoreFailed {
  ov: 'pakrypt.pakman_store_result:pakrypt_store_failed',
}

async function PakmanStore<T extends PakmanLoaded | PakmanUnlocked>(pakman: T): Promise<[T, PakmanStoreResult]> {
  const item: PakmanLocalStorageItem = { ov: 'pakrypt.pakman_local_storage_item:1.0' }

  item.pak = PutEncrypted(pakman.enc)
  if (pakman.local != null) {
    item.local = PutEncrypted(pakman.local.enc)
  }

  if (pakman.ov === 'pakrypt.pakman_state:unlocked' && pakman.local != null) {
    if (pakman.local.options.pakmanStore != null) {
      const { url, key } = pakman.local.options.pakmanStore
      const headers = new Headers()
      headers.append('Content-Type', 'text-plain')
      
      try {
        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'X-Api-Key': key,
          },
          body: item.pak,
        })

        const o = await result.json()
        if (o.success !== true) {
          console.error('Pakrypt store failed:', o)
          return [pakman, { ov: 'pakrypt.pakman_store_result:pakrypt_store_failed' }]
        }
      } catch (err) {
        console.error(err)
        return [pakman, { ov: 'pakrypt.pakman_store_result:pakrypt_store_failed' }]
      }
    }
  }

  const result = PakmanSaveLocalStorageItem(pakman.name, item)
  if (result.ov !== 'pakrypt.pakman_save_local_storage_item_result:success') {
    if (result.ov === 'pakrypt.pakman_save_local_storage_item_result:no_space') {
      return [pakman, { ov: 'pakrypt.pakman_store_result:no_space' }]
    }

    return result // never
  }

  return [pakman, { ov: 'pakrypt.pakman_store_result:success' }]
}
