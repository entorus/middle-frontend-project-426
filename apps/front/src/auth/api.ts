import type { components, operations } from '../generated/api'

type User = components['schemas']['User']
type Credentials = components['schemas']['Credentials']
type SignoutResult = operations['signout']['responses'][200]['content']['application/json']

export function authRequest(path: 'signout'): Promise<SignoutResult>
export function authRequest(path: 'signup' | 'signin', credentials: Credentials): Promise<User>
export async function authRequest(
  path: string,
  credentials?: Credentials,
): Promise<User | SignoutResult> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    ...(credentials
      ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }
      : {}),
  })
  if (!response.ok) {
    const body = (await response.json()) as components['schemas']['ApiError']
    throw new Error(body.message)
  }
  return response.json()
}
