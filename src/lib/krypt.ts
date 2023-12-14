import { Base64 } from 'js-base64'

const DEFAULT_SALT_SIZE = 16
//const DEFAULT_IV_SIZE = 16
const DEFAULT_KEY_SIZE = 256
const DEFAULT_COST = 750 * 1000

interface Encrypted {
  version: string,
  salt: Uint8Array,
  iv: Uint8Array,
  cost: number,
  key_size: number,
  ciphertext: Uint8Array,
}

export function GetEncrypted(encrypted: string): Encrypted {
  const parts = encrypted.split('$')

  if (typeof parts[0] !== 'string') throw new Error('TODO')
  if (typeof parts[1] !== 'string') throw new Error('TODO')
  if (typeof parts[2] !== 'string') throw new Error('TODO')
  if (typeof parts[3] !== 'string') throw new Error('TODO')
  if (typeof parts[4] !== 'string') throw new Error('TODO')
  if (typeof parts[5] !== 'string') throw new Error('TODO')
  if (parts.length != 6) throw new Error('TODO')

  const version = parts[0]
  const salt = Base64.toUint8Array(Base64.decode(parts[1]))
  const iv = Base64.toUint8Array(Base64.decode(parts[2]))
  const cost = parseInt(parts[3])
  if (String(cost) != parts[3]) throw new Error('TODO') // TODO: Is there another way?
  const key_size = parseInt(parts[4])
  if (String(key_size) != parts[4]) throw new Error('TODO') // TODO: Is there another way?
  const ciphertext = Base64.toUint8Array(Base64.decode(parts[5]))


  return {
    version,
    salt,
    iv,
    cost,
    key_size,
    ciphertext,
  }
}

export async function DeriveKey(passphrase: string): Promise<CryptoKey> {
  const salt = new Uint8Array(DEFAULT_SALT_SIZE)
  window.crypto.getRandomValues(salt)
  return _DeriveKey(new TextEncoder().encode(passphrase), salt, DEFAULT_COST, DEFAULT_KEY_SIZE)
}

export async function DeriveKeyWithEncrypted(passphrase: string, enc: Encrypted) {
  return _DeriveKey(new TextEncoder().encode(passphrase), enc.salt, DEFAULT_COST, DEFAULT_KEY_SIZE)
}

export async function DemoFunction() {
  console.log('it runs')
  console.log(await DeriveKey('passphrase'))
}

async function _DeriveKey(passphrase: Uint8Array, salt: Uint8Array, cost: number, key_size: number): Promise<CryptoKey> {
  const raw = await window.crypto.subtle.importKey(
    'raw',
    passphrase,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: cost,
      hash: 'SHA-256',
    },
    raw,
    {
      name: 'AES-GCM',
      length: key_size,
    },
    true,
    ['encrypt', 'decrypt'],
  )
}

export async function Decrypt(key: CryptoKey, encrypted: string) {
  const enc = GetEncrypted(encrypted)

  const cleartext = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: enc.iv,
    },
    key,
    enc.ciphertext,
  )
  return cleartext
}
