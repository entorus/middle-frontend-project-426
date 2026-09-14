import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 },
      (error, key) => {
        if (error) reject(error)
        else resolve(key)
      },
    )
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  return `scrypt-65536-8-2$${salt}$${(await derive(password, salt)).toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [algorithm, salt, encoded] = hash.split('$')
  if (
    algorithm !== 'scrypt-65536-8-2' ||
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{128}$/.test(encoded)
  )
    return false
  return timingSafeEqual(await derive(password, salt), Buffer.from(encoded, 'hex'))
}
