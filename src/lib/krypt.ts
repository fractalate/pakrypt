import { Base64 } from 'js-base64'

const DEFAULT_SALT_SIZE = 16
const DEFAULT_IV_SIZE = 16
const DEFAULT_KEY_SIZE = 256
const DEFAULT_COST = 750 * 1000

export class KryptException extends Error {}

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

  if (parts.length != 6) throw new KryptException('invalid format')
  if (typeof parts[0] !== 'string') throw new KryptException('invalid format')
  if (typeof parts[1] !== 'string') throw new KryptException('invalid format')
  if (typeof parts[2] !== 'string') throw new KryptException('invalid format')
  if (typeof parts[3] !== 'string') throw new KryptException('invalid format')
  if (typeof parts[4] !== 'string') throw new KryptException('invalid format')
  if (typeof parts[5] !== 'string') throw new KryptException('invalid format')

  const version = parts[0]
  const salt = Base64.toUint8Array(Base64.decode(parts[1]))
  const iv = Base64.toUint8Array(Base64.decode(parts[2]))
  const cost = parseInt(parts[3])
  // the js convention to check parseInt was valid by comparing   x == parseInt(x)   converts x to a number internally so we do it explicitly here (via Number which does the appropriate conversion as opposed to when called as a constructor which does not).
  if (cost != Number(parts[3])) throw new KryptException('invalid format')
  const key_size = parseInt(parts[4])
  if (key_size != Number(parts[4])) throw new KryptException('invalid format')
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
  return _DeriveKey(new TextEncoder().encode(passphrase), enc.salt, enc.cost, enc.key_size)
}

export async function DeriveKey(passphrase: string): Promise<[CryptoKey, Uint8Array]> {
  const salt = new Uint8Array(DEFAULT_SALT_SIZE)
  window.crypto.getRandomValues(salt)
  return [await _DeriveKey(new TextEncoder().encode(passphrase), salt, DEFAULT_COST, DEFAULT_KEY_SIZE), salt]
}

async function _DeriveKey(passphrase: Uint8Array, salt: Uint8Array, cost: number, key_size: number): Promise<CryptoKey> {
  const raw = await window.crypto.subtle.importKey(
    'raw',
    passphrase,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  const key = await window.crypto.subtle.deriveKey(
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
  return key
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

export async function Encrypt(key: CryptoKey, salt: Uint8Array, buffer: Uint8Array): Promise<Encrypted> {
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

export async function DoCryptoTest() {
  async function encryptIt() {
    console.log('encoding...')
    const cleartext = new TextEncoder().encode('cleartext')
    console.log('deriving key...')
    const [key, salt] = await DeriveKey('password')
    console.log(key)
    const raw = await crypto.subtle.exportKey('raw', key)
    console.log('exported key', new Uint8Array(raw))
    console.log('encrypting...')
    const enc = await Encrypt(key, salt, cleartext)
    console.log(enc)
    const data = PutEncrypted(enc)
    console.log('produced', data)
    return data
  }

  async function decryptIt(data: string) {
    console.log('decrypting', data)
    const enc = GetEncrypted(data)
    console.log(enc)
    console.log('deriving key...')
    const key = await DeriveKeyWithEncrypted('password', enc)
    console.log(key)
    const raw = await crypto.subtle.exportKey('raw', key)
    console.log('exported key', new Uint8Array(raw))
    console.log('decrypting...')
    const cleartext = await Decrypt(key, enc)
    console.log('decoding...')
    if (new TextDecoder().decode(cleartext) !== 'cleartext') {
      throw Error('Encrypt/decrypt error!')
    }
    console.log('all good')
  }

  const input = new TextEncoder().encode('test')
  const encoded = Base64.encode(Base64.fromUint8Array(input))
  const decoded = Base64.toUint8Array(Base64.decode(encoded))
  const output = new TextDecoder().decode(decoded)

  console.log('input', input)
  console.log('decoded', decoded)
  console.log('output', output)

  const data = await encryptIt()
  await decryptIt(data)
}

DoCryptoTest()
