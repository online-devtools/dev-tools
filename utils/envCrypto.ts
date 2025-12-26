// .env encryption utilities for protecting sensitive values in config files.
// The format uses ENC::<base64(json)> so metadata can travel with each value.

import CryptoJS from 'crypto-js'

export type EnvCryptoErrorCode = 'empty' | 'missingPassword' | 'invalidPayload' | 'decryptFailed'

export class EnvCryptoError extends Error {
  code: EnvCryptoErrorCode

  constructor(code: EnvCryptoErrorCode, message: string) {
    super(message)
    this.name = 'EnvCryptoError'
    this.code = code
  }
}

type EnvLine =
  | { type: 'comment'; raw: string }
  | { type: 'blank'; raw: string }
  | { type: 'pair'; raw: string; key: string; value: string }

type CryptoMetadata = {
  v: number
  alg: string
  ct: string
  iv: string
  salt: string
  iter: number
}

type EncryptOptions = {
  salt?: string
  iv?: string
  iterations?: number
}

// Prefix stored values so encrypted payloads are easy to recognize.
const ENC_PREFIX = 'ENC::'
// Sentinel ensures decryption can verify the password and preserve empty values.
const ENC_SENTINEL = '__ENV__::'

const ensureNotEmpty = (input: string) => {
  // Empty input should fail fast to give the UI a specific error state.
  if (!input.trim()) {
    throw new EnvCryptoError('empty', 'Input is empty')
  }
}

const ensurePassword = (password: string) => {
  // Encryption and decryption require a non-empty password.
  if (!password.trim()) {
    throw new EnvCryptoError('missingPassword', 'Password is required')
  }
}

const base64Encode = (input: string): string => {
  // Use browser btoa when available, otherwise fall back to Node Buffer.
  if (typeof btoa === 'function') {
    return btoa(input)
  }
  return Buffer.from(input, 'utf-8').toString('base64')
}

const base64Decode = (input: string): string => {
  // Use browser atob when available, otherwise fall back to Node Buffer.
  if (typeof atob === 'function') {
    return atob(input)
  }
  return Buffer.from(input, 'base64').toString('utf-8')
}

const parseEnvLines = (input: string): { lines: EnvLine[]; trailingNewline: boolean } => {
  // Preserve whether the original input ended with a newline for round-tripping.
  const trailingNewline = input.endsWith('\n')
  const normalized = input.replace(/\r\n/g, '\n')
  const rawLines = normalized.split('\n')
  if (trailingNewline && rawLines[rawLines.length - 1] === '') {
    // Drop the artificial empty line introduced by split so we can re-add later.
    rawLines.pop()
  }

  const lines: EnvLine[] = rawLines.map((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      return { type: 'blank', raw }
    }
    if (trimmed.startsWith('#')) {
      return { type: 'comment', raw }
    }

    const separator = raw.indexOf('=')
    if (separator === -1) {
      // Treat non key=value lines as comments to avoid data loss.
      return { type: 'comment', raw }
    }

    const key = raw.slice(0, separator).trim()
    const value = raw.slice(separator + 1)
    return { type: 'pair', raw, key, value }
  })

  return { lines, trailingNewline }
}

const serializeEnvLines = (lines: EnvLine[], trailingNewline: boolean): string => {
  // Reassemble the .env content, preserving the original newline ending.
  const joined = lines.map((line) => line.raw).join('\n')
  return trailingNewline ? `${joined}\n` : joined
}

const encryptValue = (value: string, password: string, options?: EncryptOptions): string => {
  // Use PBKDF2 to derive a key from the password and a salt.
  const salt = options?.salt
    ? CryptoJS.enc.Hex.parse(options.salt)
    : CryptoJS.lib.WordArray.random(16)
  const iv = options?.iv
    ? CryptoJS.enc.Hex.parse(options.iv)
    : CryptoJS.lib.WordArray.random(16)
  const iterations = options?.iterations ?? 10000

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations,
  })

  // Prefix the plaintext with a sentinel so decryption can validate the password.
  const payload = `${ENC_SENTINEL}${value}`
  const encrypted = CryptoJS.AES.encrypt(payload, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  const metadata: CryptoMetadata = {
    v: 1,
    alg: 'AES-256-CBC',
    ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Hex),
    salt: salt.toString(CryptoJS.enc.Hex),
    iter: iterations,
  }

  return `${ENC_PREFIX}${base64Encode(JSON.stringify(metadata))}`
}

const decryptValue = (value: string, password: string): string => {
  // Encrypted values are stored as ENC::<base64(json)> to keep metadata intact.
  if (!value.startsWith(ENC_PREFIX)) {
    return value
  }

  const encoded = value.slice(ENC_PREFIX.length)
  let metadata: CryptoMetadata

  try {
    metadata = JSON.parse(base64Decode(encoded)) as CryptoMetadata
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid payload'
    throw new EnvCryptoError('invalidPayload', message)
  }

  const salt = CryptoJS.enc.Hex.parse(metadata.salt)
  const iv = CryptoJS.enc.Hex.parse(metadata.iv)

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: metadata.iter,
  })

  // Recreate CipherParams from base64 so CryptoJS can decrypt correctly.
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(metadata.ct),
  })
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
  if (!plaintext.startsWith(ENC_SENTINEL)) {
    // When the password is wrong, the sentinel will be missing.
    throw new EnvCryptoError('decryptFailed', 'Failed to decrypt value')
  }

  // Strip the sentinel so callers get back the original value (may be empty).
  return plaintext.slice(ENC_SENTINEL.length)
}

export const encryptEnv = (input: string, password: string, options?: EncryptOptions): string => {
  ensureNotEmpty(input)
  ensurePassword(password)

  const { lines, trailingNewline } = parseEnvLines(input)
  const encryptedLines = lines.map((line) => {
    if (line.type !== 'pair') {
      return line
    }

    // Preserve the original key formatting but replace the value segment.
    const encryptedValue = encryptValue(line.value, password, options)
    return {
      ...line,
      raw: `${line.key}=${encryptedValue}`,
      value: encryptedValue,
    }
  })

  return serializeEnvLines(encryptedLines, trailingNewline)
}

export const decryptEnv = (input: string, password: string): string => {
  ensureNotEmpty(input)
  ensurePassword(password)

  const { lines, trailingNewline } = parseEnvLines(input)
  const decryptedLines = lines.map((line) => {
    if (line.type !== 'pair') {
      return line
    }

    const decryptedValue = decryptValue(line.value, password)
    return {
      ...line,
      raw: `${line.key}=${decryptedValue}`,
      value: decryptedValue,
    }
  })

  return serializeEnvLines(decryptedLines, trailingNewline)
}
