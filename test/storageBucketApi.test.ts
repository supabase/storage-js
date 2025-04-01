import { StorageClient } from '../src/index'
import { StorageError } from '../src/lib/errors'

// Create a simple Response implementation for testing
class MockResponse {
  ok: boolean
  status: number
  statusText: string
  private body: string

  constructor(body: string, options: { status: number; statusText: string }) {
    this.body = body
    this.status = options.status
    this.statusText = options.statusText
    this.ok = this.status >= 200 && this.status < 300
  }

  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

// Mock URL and credentials for testing
const URL = 'http://localhost:8000/storage/v1'
const KEY = 'test-api-key'

describe('Bucket API Error Handling', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('listBuckets', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.listBuckets()
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })

  describe('getBucket', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.getBucket('non-existent-bucket')
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })

  describe('createBucket', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.createBucket('new-bucket')
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })

  describe('updateBucket', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.updateBucket('existing-bucket', { public: true })
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })

  describe('emptyBucket', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.emptyBucket('existing-bucket')
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })

  describe('deleteBucket', () => {
    it('handles network errors', async () => {
      const mockError = new Error('Network failure')
      global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
      const storage = new StorageClient(URL, { apikey: KEY })

      const { data, error } = await storage.deleteBucket('existing-bucket')
      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.message).toBe('Network failure')
    })
  })
})
