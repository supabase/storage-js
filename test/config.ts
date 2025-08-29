import { StorageClient } from '../src/index'

export const STORAGE_URL = 'http://localhost:8000/storage/v1'

export const TEST_KEY = 'test-api-key'

export const JWT_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjMxN2VhZGNlLTYzMWEtNDQyOS1hMGJiLWYxOWE3YTUxN2I0YSIsImlhdCI6MTcxMzQzMzgwMCwiZXhwIjoyMDI5MDA5ODAwfQ.jVFIR-MB7rNfUuJaUH-_CyDFZEHezzXiqcRcdrGd29o'

export function createStorageClient(options?: {
  apikey?: string
  jwt?: boolean
  customUrl?: string
}) {
  const { apikey = TEST_KEY, jwt = false, customUrl } = options || {}
  const url = customUrl || STORAGE_URL

  if (jwt) {
    return new StorageClient(url, { Authorization: `Bearer ${JWT_KEY}` })
  }

  return new StorageClient(url, { apikey })
}

export function createJWTStorageClient(customUrl?: string) {
  return createStorageClient({ jwt: true, customUrl })
}

export function createTestStorageClient(customUrl?: string) {
  return createStorageClient({ customUrl })
}
