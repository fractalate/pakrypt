import { Decrypt, DeriveKeyWithEncrypted, Encrypt, Encrypted, GetEncrypted, PutEncrypted } from '../lib/krypt'
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
  enc: Encrypted,
}
export interface PakmanUnlocked {
  ov: 'pakrypt.pakmanstate:unlocked',
  name: string,
  enc: Encrypted,
  key: CryptoKey,
  pak: Pak,
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

export function PakmanLoadDefault(): [Pakman, PakmanLoadResult] {
  return PakmanLoad('default')
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
    return [pakman, {
      ov: 'pakrypt.pakmanunlockresult:decrypterror',
    }]
  }

  let data
  try {
    data = new TextDecoder().decode(buffer)
  } catch (err) {
    return [pakman, { ov: 'pakrypt.pakmanunlockresult:decodeerror' }]
  }

  let pak
  try {
    pak = JSON.parse(data) // TODO: Validate the JSON structure maybe.
  } catch (err) {
    if (err instanceof SyntaxError) {
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

export type PakmanSaveResult = (
  | PakmanSaveResultSuccess
)
export interface PakmanSaveResultSuccess {
  ov: 'pakrypt.pakmansaveresult:success',
}

export async function PakmanSave(pakman: PakmanUnlocked, pak: Pak): Promise<[Pakman, PakmanSaveResult]> {
  // TODO: Do encryption!

  const storage = `pakrypt.pak[${pakman.name}]`
  const buffer = new TextEncoder().encode(JSON.stringify(pak))
  const enc = await Encrypt(pakman.key, buffer)

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
