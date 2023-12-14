import { Base64 } from 'js-base64'

const DEFAULT_SALT_SIZE = 16
const DEFAULT_IV_SIZE = 16
const DEFAULT_KEY_SIZE = 256
const DEFAULT_COST = 750 * 1000

export interface Encrypted {
  version: string,
  salt: Uint8Array,
  iv: Uint8Array,
  cost: number,
  key_size: number,
  ciphertext: Uint8Array,
}

export function GetEncrypted(data: string): Encrypted {
  const parts = data.split('$')

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

export function PutEncrypted(enc: Encrypted): string {
  return [
    enc.version,
    Base64.encode(Base64.fromUint8Array(enc.salt)),
    Base64.encode(Base64.fromUint8Array(enc.iv)),
    '' + enc.cost,
    '' + enc.key_size,
    Base64.encode(Base64.fromUint8Array(enc.ciphertext)),
  ].join('$')
}

export async function DeriveKeyWithEncrypted(passphrase: string, enc: Encrypted): Promise<CryptoKey> {
  return _DeriveKey(new TextEncoder().encode(passphrase), enc.salt, DEFAULT_COST, DEFAULT_KEY_SIZE)
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

export async function Decrypt(key: CryptoKey, enc: Encrypted): Promise<Uint8Array> {
  const cleartext = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: enc.iv,
    },
    key,
    enc.ciphertext,
  )
  return new Uint8Array(cleartext)
}

export async function Encrypt(key: CryptoKey, buffer: Uint8Array): Promise<Encrypted> {
  const salt = new Uint8Array(DEFAULT_SALT_SIZE)
  await window.crypto.getRandomValues(salt)
  const iv = new Uint8Array(DEFAULT_IV_SIZE)
  await window.crypto.getRandomValues(iv)
  const cost = DEFAULT_COST
  const key_size = DEFAULT_KEY_SIZE
  const ciphertext = new Uint8Array(await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    buffer,
  ))
  return {
    version: '0',
    salt,
    iv,
    cost,
    key_size,
    ciphertext,
  }
}
