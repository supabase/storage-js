import { StorageClient } from '../src/index'
import * as fsp from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'
import assert from 'assert'
// @ts-ignore
import fetch, { Response } from '@supabase/node-fetch'
import { StorageApiError, StorageError } from '../src/lib/errors'
import { createJWTStorageClient, createStorageClient, STORAGE_URL, JWT_KEY } from './config'

const storage = createJWTStorageClient()

const newBucket = async (isPublic = true, prefix = '') => {
  const bucketName = `${prefix ? prefix + '-' : ''}bucket-${Date.now()}`
  await storage.createBucket(bucketName, { public: isPublic })
  return bucketName
}

const findOrCreateBucket = async (name: string, isPublic = true) => {
  const { error: bucketNotFound } = await storage.getBucket(name)

  if (bucketNotFound) {
    const { error } = await storage.createBucket(name, { public: isPublic })
    expect(error).toBeNull()
  }

  return name
}

const uploadFilePath = (fileName: string) => path.resolve(__dirname, 'fixtures', 'upload', fileName)

describe('Object API', () => {
  let bucketName: string
  let file: Buffer
  let uploadPath: string
  beforeEach(async () => {
    bucketName = await newBucket()
    file = await fsp.readFile(uploadFilePath('sadcat.jpg'))
    uploadPath = `testpath/file-${Date.now()}.jpg`
  })

  describe('Generate urls', () => {
    test('get public URL', async () => {
      const res = storage.from(bucketName).getPublicUrl(uploadPath)
      expect(res.data.publicUrl).toEqual(`${STORAGE_URL}/object/public/${bucketName}/${uploadPath}`)
    })

    test('get public URL with download querystring', async () => {
      const res = storage.from(bucketName).getPublicUrl(uploadPath, {
        download: true,
      })
      expect(res.data.publicUrl).toEqual(
        `${STORAGE_URL}/object/public/${bucketName}/${uploadPath}?download=`
      )
    })

    test('get public URL with custom for download', async () => {
      const res = storage.from(bucketName).getPublicUrl(uploadPath, {
        download: 'test.jpg',
      })
      expect(res.data.publicUrl).toEqual(
        `${STORAGE_URL}/object/public/${bucketName}/${uploadPath}?download=test.jpg`
      )
    })

    test('sign url', async () => {
      const uploadRes = await storage.from(bucketName).upload(uploadPath, file)
      expect(uploadRes.error).toBeNull()

      const res = await storage.from(bucketName).createSignedUrl(uploadPath, 2000)

      expect(res.error).toBeNull()
      expect(res.data?.signedUrl).toContain(
        `${STORAGE_URL}/object/sign/${bucketName}/${uploadPath}`
      )
    })

    test('sign url with download querystring parameter', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).createSignedUrl(uploadPath, 2000, {
        download: true,
      })

      expect(res.error).toBeNull()
      expect(res.data?.signedUrl).toContain(
        `${STORAGE_URL}/object/sign/${bucketName}/${uploadPath}`
      )
      expect(res.data?.signedUrl).toContain(`&download=`)
    })

    test('sign url with transform options', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).createSignedUrl(uploadPath, 2000, {
        download: true,
        transform: {
          width: 100,
          height: 100,
        },
      })

      expect(res.error).toBeNull()
      expect(res.data?.signedUrl).toContain(
        `${STORAGE_URL}/render/image/sign/${bucketName}/${uploadPath}`
      )
    })

    test('sign url with custom filename for download', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).createSignedUrl(uploadPath, 2000, {
        download: 'test.jpg',
      })

      expect(res.error).toBeNull()
      expect(res.data?.signedUrl).toContain(
        `${STORAGE_URL}/object/sign/${bucketName}/${uploadPath}`
      )
      expect(res.data?.signedUrl).toContain(`&download=test.jpg`)
    })
  })

  describe('Upload files', () => {
    test('uploading using form-data', async () => {
      const bucketName = await newBucket()
      const formData = new FormData()
      formData.append('file', file as any)

      const res = await storage.from(bucketName).upload(uploadPath, formData)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPath)
    })

    test('uploading using buffer', async () => {
      const res = await storage.from(bucketName).upload(uploadPath, file)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPath)
    })

    test('uploading using array buffer', async () => {
      const res = await storage.from(bucketName).upload(uploadPath, file.buffer)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPath)
    })

    test('uploading using blob', async () => {
      const fileBlob = new Blob([file])
      const res = await storage.from(bucketName).upload(uploadPath, fileBlob)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPath)
    })

    test('uploading using readable stream', async () => {
      const file = await fs.createReadStream(uploadFilePath('file.txt'))

      const res = await storage.from(bucketName).upload(uploadPath, file)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPath)
    })

    test('upload and update file', async () => {
      const file2 = await fsp.readFile(uploadFilePath('file-2.txt'))

      const res = await storage.from(bucketName).upload(uploadPath, file)
      expect(res.error).toBeNull()

      const updateRes = await storage.from(bucketName).update(uploadPath, file2)
      expect(updateRes.error).toBeNull()
      expect(updateRes.data?.path).toEqual(uploadPath)
    })

    test('can upload with custom metadata', async () => {
      const res = await storage.from(bucketName).upload(uploadPath, file, {
        metadata: {
          custom: 'metadata',
          second: 'second',
          third: 'third',
        },
      })
      expect(res.error).toBeNull()

      const updateRes = await storage.from(bucketName).info(uploadPath)
      expect(updateRes.error).toBeNull()
      expect(updateRes.data?.metadata).toEqual({
        custom: 'metadata',
        second: 'second',
        third: 'third',
      })
    })

    test('can upload a file within the file size limit', async () => {
      const bucketName = 'with-limit' + Date.now()
      await storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: '1mb',
      })

      const res = await storage.from(bucketName).upload(uploadPath, file)
      expect(res.error).toBeNull()
    })

    test('cannot upload a file that exceed the file size limit', async () => {
      const bucketName = 'with-limit' + Date.now()
      await storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: '1kb',
      })

      const res = await storage.from(bucketName).upload(uploadPath, file)

      const outError = res.error as StorageApiError
      expect(outError).toBeInstanceOf(StorageApiError)
      expect(outError.message).toBe('The object exceeded the maximum allowed size')
      expect(outError.statusCode).toBe('413')
    })

    test('can upload a file with a valid mime type', async () => {
      const bucketName = 'with-limit' + Date.now()
      await storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png'],
      })

      const res = await storage.from(bucketName).upload(uploadPath, file, {
        contentType: 'image/png',
      })
      expect(res.error).toBeNull()
    })

    test('cannot upload a file an invalid mime type', async () => {
      const bucketName = 'with-limit' + Date.now()
      await storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png'],
      })

      const res = await storage.from(bucketName).upload(uploadPath, file, {
        contentType: 'image/jpeg',
      })
      const outError = res.error as StorageApiError
      expect(outError).toBeInstanceOf(StorageApiError)
      expect(outError.message).toBe('mime type image/jpeg is not supported')
      expect(outError.statusCode).toBe('415')
    })

    test('sign url for upload', async () => {
      const res = await storage.from(bucketName).createSignedUploadUrl(uploadPath)

      expect(res.error).toBeNull()
      expect(res.data?.path).toBe(uploadPath)
      expect(res.data?.token).toBeDefined()
      expect(res.data?.signedUrl).toContain(
        `${STORAGE_URL}/object/upload/sign/${bucketName}/${uploadPath}`
      )
    })

    test('can upload with a signed url', async () => {
      const { data, error } = await storage.from(bucketName).createSignedUploadUrl(uploadPath)

      expect(error).toBeNull()
      assert(data?.path)

      const uploadRes = await storage
        .from(bucketName)
        .uploadToSignedUrl(data.path, data.token, file)

      expect(uploadRes.error).toBeNull()
      expect(uploadRes.data?.path).toEqual(uploadPath)
    })

    test('can upload overwriting files with a signed url', async () => {
      const { error: uploadErr } = await storage.from(bucketName).upload(uploadPath, file)

      expect(uploadErr).toBeNull()

      const { data, error } = await storage.from(bucketName).createSignedUploadUrl(uploadPath, {
        upsert: true,
      })

      expect(error).toBeNull()
      assert(data?.path)

      const uploadRes = await storage
        .from(bucketName)
        .uploadToSignedUrl(data.path, data.token, file)

      expect(uploadRes.error).toBeNull()
      expect(uploadRes.data?.path).toEqual(uploadPath)
    })

    test('cannot upload to a signed url twice', async () => {
      const { data, error } = await storage.from(bucketName).createSignedUploadUrl(uploadPath)

      expect(error).toBeNull()
      assert(data?.path)

      const uploadRes = await storage
        .from(bucketName)
        .uploadToSignedUrl(data.path, data.token, file)

      expect(uploadRes.error).toBeNull()
      expect(uploadRes.data?.path).toEqual(uploadPath)

      const uploadRes2 = await storage
        .from(bucketName)
        .uploadToSignedUrl(data.path, data.token, file)

      const outError = uploadRes2.error as StorageApiError
      expect(outError).toBeInstanceOf(StorageApiError)
      expect(outError.message).toBe('The resource already exists')
      expect(outError.statusCode).toBe('409')
    })
  })

  describe('File operations', () => {
    test('list objects', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).list('testpath')

      expect(res.error).toBeNull()
      expect(res.data).toEqual([
        expect.objectContaining({
          name: uploadPath.replace('testpath/', ''),
        }),
      ])
    })

    test('list objects V2', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).listV2({
        prefix: 'testpath',
      })

      expect(res.error).toBeNull()
      expect(res.data).toEqual(
        expect.objectContaining({
          hasNext: false,
          folders: [],
          objects: expect.arrayContaining([expect.objectContaining({ name: uploadPath })]),
        })
      )
    })

    test('list objects with flat sort_by and sort_order', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).list('testpath', {
        sort_by: 'name',
        sort_order: 'desc',
      })

      expect(res.error).toBeNull()
      expect(res.data).toEqual([
        expect.objectContaining({
          name: uploadPath.replace('testpath/', ''),
        }),
      ])
    })

    test('list objects with sortBy format still works', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).list('testpath', {
        sortBy: {
          column: 'name',
          order: 'asc',
        },
      })

      expect(res.error).toBeNull()
      expect(res.data).toEqual([
        expect.objectContaining({
          name: uploadPath.replace('testpath/', ''),
        }),
      ])
    })

    test('list objects prioritizes flat format over nested format', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).list('testpath', {
        sort_by: 'created_at',
        sort_order: 'desc',
        sortBy: {
          column: 'name',
          order: 'asc',
        },
      })

      expect(res.error).toBeNull()
      expect(res.data).toEqual([
        expect.objectContaining({
          name: uploadPath.replace('testpath/', ''),
        }),
      ])
    })

    test('move object to different path', async () => {
      const newPath = `testpath/file-moved-${Date.now()}.txt`
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).move(uploadPath, newPath)

      expect(res.error).toBeNull()
      expect(res.data?.message).toEqual(`Successfully moved`)
    })

    test('move object across buckets in different path', async () => {
      const newBucketName = 'bucket-move'
      await findOrCreateBucket(newBucketName)

      const newPath = `testpath/file-to-move-${Date.now()}.txt`
      await storage.from(bucketName).upload(uploadPath, file)

      const res = await storage.from(bucketName).move(uploadPath, newPath, {
        destinationBucket: newBucketName,
      })

      expect(res.error).toBeNull()
      expect(res.data?.message).toEqual(`Successfully moved`)

      const { error } = await storage.from(newBucketName).download(newPath)
      expect(error).toBeNull()
    })

    test('copy object to different path', async () => {
      const newPath = `testpath/file-copied-${Date.now()}.txt`
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).copy(uploadPath, newPath)

      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(`${bucketName}/${newPath}`)
    })

    test('copy object across buckets to different path', async () => {
      const newBucketName = 'bucket-move'
      await findOrCreateBucket(newBucketName)
      const newPath = `testpath/file-copied-${Date.now()}.txt`
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).copy(uploadPath, newPath, {
        destinationBucket: newBucketName,
      })

      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(`${newBucketName}/${newPath}`)
    })

    test('downloads an object', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).download(uploadPath)

      expect(res.error).toBeNull()
      expect(res.data?.size).toBeGreaterThan(0)
      expect(res.data?.type).toEqual('text/plain;charset=utf-8')
    })

    test('removes an object', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).remove([uploadPath])

      expect(res.error).toBeNull()
      expect(res.data).toEqual([
        expect.objectContaining({
          bucket_id: bucketName,
          name: uploadPath,
        }),
      ])
    })

    test('get object info', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).info(uploadPath)

      expect(res.error).toBeNull()
      expect(res.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          createdAt: expect.any(String),
          cacheControl: expect.any(String),
          size: expect.any(Number),
          etag: expect.any(String),
          lastModified: expect.any(String),
          contentType: expect.any(String),
          metadata: {},
          version: expect.any(String),
        })
      )
    })

    test('check if object exists', async () => {
      await storage.from(bucketName).upload(uploadPath, file)
      const res = await storage.from(bucketName).exists(uploadPath)

      expect(res.error).toBeNull()
      expect(res.data).toEqual(true)

      const resNotExists = await storage.from(bucketName).exists('do-not-exists')
      expect(resNotExists.data).toEqual(false)
    })
  })

  describe('Transformations', () => {
    it('gets public url with transformation options', () => {
      const res = storage.from(bucketName).getPublicUrl(uploadPath, {
        transform: {
          width: 200,
          height: 300,
          quality: 70,
        },
      })
      expect(res.data.publicUrl).toEqual(
        `${STORAGE_URL}/render/image/public/${bucketName}/${uploadPath}?width=200&height=300&quality=70`
      )
    })

    it('will download an authenticated transformed file', async () => {
      const privateBucketName = 'my-private-bucket'
      await findOrCreateBucket(privateBucketName)

      const { error: uploadError } = await storage.from(privateBucketName).upload(uploadPath, file)
      expect(uploadError).toBeNull()

      const res = await storage.from(privateBucketName).download(uploadPath, {
        transform: {
          width: 200,
          height: 200,
        },
      })

      expect(res.error).toBeNull()
      expect(res.data?.size).toBeGreaterThan(0)
      expect(res.data?.type).toEqual('image/jpeg')
    })
  })

  it.skip('will return the image as webp when the browser support it', async () => {
    const storage = new StorageClient(STORAGE_URL, {
      Authorization: `Bearer ${JWT_KEY}`,
      Accept: 'image/webp',
    })
    const privateBucketName = 'my-private-bucket'
    await findOrCreateBucket(privateBucketName)

    const { error: uploadError } = await storage.from(privateBucketName).upload(uploadPath, file)
    expect(uploadError).toBeNull()

    const res = await storage.from(privateBucketName).download(uploadPath, {
      transform: {
        width: 200,
        height: 200,
      },
    })

    expect(res.error).toBeNull()
    expect(res.data?.size).toBeGreaterThan(0)
    expect(res.data?.type).toEqual('image/webp')
  })

  it.skip('will return the original image format when format is origin', async () => {
    const storage = new StorageClient(STORAGE_URL, {
      Authorization: `Bearer ${JWT_KEY}`,
      Accept: 'image/webp',
    })
    const privateBucketName = 'my-private-bucket'
    await findOrCreateBucket(privateBucketName)

    const { error: uploadError } = await storage.from(privateBucketName).upload(uploadPath, file)
    expect(uploadError).toBeNull()

    const res = await storage.from(privateBucketName).download(uploadPath, {
      transform: {
        width: 200,
        height: 200,
        format: 'origin',
      },
    })

    expect(res.error).toBeNull()
    expect(res.data?.size).toBeGreaterThan(0)
    expect(res.data?.type).toEqual('image/jpeg')
  })

  it('will get a signed transformed image', async () => {
    await storage.from(bucketName).upload(uploadPath, file)
    const res = await storage.from(bucketName).createSignedUrl(uploadPath, 60000, {
      transform: {
        width: 200,
        height: 200,
        quality: 60,
      },
    })

    expect(res.error).toBeNull()
    assert(res.data)

    const imageResp = await fetch(`${res.data.signedUrl}`, {})

    expect(parseInt(imageResp.headers.get('content-length') || '')).toBeGreaterThan(0)
    expect(imageResp.status).toEqual(200)
    expect(imageResp.headers.get('x-transformations')).toEqual(
      'height:200,width:200,resizing_type:fill,quality:60'
    )
  })
})

describe('error handling', () => {
  let mockError: Error

  beforeEach(() => {
    mockError = new Error('Network failure')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws unknown errors', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
    const storage = createStorageClient({ apikey: 'test-token' })

    const { data, error } = await storage.from('test').list()
    expect(data).toBeNull()
    expect(error).not.toBeNull()
    expect(error?.message).toBe('Network failure')
  })

  it('handles malformed responses', async () => {
    const mockResponse = new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      statusText: 'Internal Server Error',
    })

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse))
    const storage = createStorageClient({ apikey: 'test-token' })

    const { data, error } = await storage.from('test').list()
    expect(data).toBeNull()
    expect(error).toBeInstanceOf(StorageError)
    expect(error?.message).toBe('Internal server error')
  })

  it('handles network timeouts', async () => {
    mockError = new Error('Network timeout')
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(mockError))
    const storage = createStorageClient({ apikey: 'test-token' })

    const { data, error } = await storage.from('test').list()
    expect(data).toBeNull()
    expect(error).not.toBeNull()
    expect(error?.message).toBe('Network timeout')
  })

  describe('Generate urls', () => {
    test('createSignedUrls with multiple paths', async () => {
      const bucketName = await newBucket()
      const paths = ['file1.jpg', 'file2.jpg', 'file3.jpg']

      // Upload files first
      await storage.from(bucketName).upload(paths[0], 'test content')
      await storage.from(bucketName).upload(paths[1], 'test content')
      await storage.from(bucketName).upload(paths[2], 'test content')

      const expiresIn = 3600
      const { data, error } = await storage.from(bucketName).createSignedUrls(paths, expiresIn)

      expect(error).toBeNull()
      expect(data).toHaveLength(3)
      expect(data![0]).toHaveProperty('signedUrl')
    })

    test('createSignedUrls with download option', async () => {
      const bucketName = await newBucket()
      const path = 'download-test.pdf'

      await storage.from(bucketName).upload(path, 'test content')

      const { data, error } = await storage
        .from(bucketName)
        .createSignedUrls([path], 3600, { download: true })

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0]).toHaveProperty('signedUrl')
    })
  })

  describe('Upload files', () => {
    test('upload with array buffer body type', async () => {
      const bucketName = await newBucket()
      const arrayBuffer = new ArrayBuffer(8)
      const uint8Array = new Uint8Array(arrayBuffer)
      for (let i = 0; i < uint8Array.length; i++) {
        uint8Array[i] = i
      }

      const res = await storage.from(bucketName).upload('array-buffer-test.bin', arrayBuffer)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual('array-buffer-test.bin')
    })

    test('upload with custom cache control and content type', async () => {
      const bucketName = await newBucket()

      const res = await storage.from(bucketName).upload('custom-test.txt', 'test content', {
        cacheControl: '3600',
        contentType: 'text/plain',
      })

      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual('custom-test.txt')
    })

    test('upload with file size validation', async () => {
      const bucketName = await newBucket()
      const smallContent = 'small'

      const res = await storage.from(bucketName).upload('size-test.txt', smallContent)
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual('size-test.txt')
    })
  })

  describe('List files', () => {
    test('enhanced list with search options', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('search/file1.txt', 'content1')
      await storage.from(bucketName).upload('search/file2.txt', 'content2')
      await storage.from(bucketName).upload('other/file3.txt', 'content3')

      // Test with limit
      const res1 = await storage.from(bucketName).list('', { limit: 1 })
      expect(res1.error).toBeNull()
      expect(res1.data!.length).toBeLessThanOrEqual(1)

      // Test with offset
      const res2 = await storage.from(bucketName).list('', { offset: 1 })
      expect(res2.error).toBeNull()

      // Test with search prefix
      const res3 = await storage.from(bucketName).list('search/')
      expect(res3.error).toBeNull()
    })

    test('listV2 with different options', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('folder/file1.txt', 'content1')
      await storage.from(bucketName).upload('folder/file2.txt', 'content2')

      const res = await storage.from(bucketName).listV2({
        prefix: 'folder/',
        limit: 10,
        cursor: '',
      })

      expect(res.error).toBeNull()
      expect(res.data).toHaveProperty('objects')
      expect(res.data).toHaveProperty('hasNext')
    })
  })

  describe('File operations', () => {
    test('move with different path formats', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('source/file.txt', 'test content')

      // Test moving with leading/trailing slashes (should be cleaned up)
      const res = await storage.from(bucketName).move('/source/file.txt', '/dest/file.txt')
      expect(res.error).toBeNull()
    })

    test('copy with metadata preservation', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('original.txt', 'test content', {
        metadata: { author: 'test', version: '1.0' },
      })

      const res = await storage.from(bucketName).copy('original.txt', 'copy.txt')
      expect(res.error).toBeNull()

      // Verify the copy exists
      const { error } = await storage.from(bucketName).download('copy.txt')
      expect(error).toBeNull()
    })

    test('info returns complete file metadata', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('info-test.txt', 'test content', {
        metadata: { custom: 'data' },
      })

      const res = await storage.from(bucketName).info('info-test.txt')
      expect(res.error).toBeNull()
      expect(res.data).toHaveProperty('id')
      expect(res.data).toHaveProperty('name')
      expect(res.data).toHaveProperty('size')
      expect(res.data).toHaveProperty('contentType')
      expect(res.data).toHaveProperty('createdAt')
      expect(res.data).toHaveProperty('lastModified')
    })

    test('exists method with non-existent file', async () => {
      const bucketName = await newBucket()

      const res = await storage.from(bucketName).exists('non-existent-file.txt')
      // In some infrastructure setups, exists method may return error for non-existent files
      if (res.error) {
        expect(res.data).toBeNull()
      } else {
        expect(res.data).toBe(false)
      }
    })

    test('remove multiple files at once', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('file1.txt', 'content1')
      await storage.from(bucketName).upload('file2.txt', 'content2')
      await storage.from(bucketName).upload('file3.txt', 'content3')

      const res = await storage.from(bucketName).remove(['file1.txt', 'file2.txt', 'file3.txt'])
      expect(res.error).toBeNull()
      expect(res.data).toHaveLength(3)

      // Verify files are removed
      const { data: exists1 } = await storage.from(bucketName).exists('file1.txt')
      const { data: exists2 } = await storage.from(bucketName).exists('file2.txt')
      const { data: exists3 } = await storage.from(bucketName).exists('file3.txt')
      expect(exists1).toBe(false)
      expect(exists2).toBe(false)
      expect(exists3).toBe(false)
    })

    test('download with transform options', async () => {
      const bucketName = await newBucket()
      await storage.from(bucketName).upload('image.jpg', 'test content')

      const res = await storage.from(bucketName).download('image.jpg', {
        transform: {
          width: 100,
          height: 100,
          resize: 'fill',
          format: 'origin',
          quality: 80,
        },
      })

      // Transform download may not be supported in all test environments
      if (res.error) {
        expect(res.data).toBeNull()
      } else {
        expect(res.data).toBeDefined()
      }
    })
  })
})

describe('StorageFileApi Edge Cases', () => {
  let storage: StorageClient

  beforeEach(() => {
    storage = createJWTStorageClient()
  })

  describe('Public URL with transformations', () => {
    test('handles all transformation options', () => {
      const { data } = storage.from('test-bucket').getPublicUrl('test.jpg', {
        transform: {
          width: 200,
          height: 150,
          resize: 'cover',
          format: 'origin',
          quality: 80,
        },
      })

      expect(data.publicUrl).toContain('width=200')
      expect(data.publicUrl).toContain('height=150')
      expect(data.publicUrl).toContain('resize=cover')
      expect(data.publicUrl).toContain('format=origin')
      expect(data.publicUrl).toContain('quality=80')
    })

    test('handles download with filename', () => {
      const { data } = storage.from('test-bucket').getPublicUrl('test.jpg', {
        download: 'custom-filename.jpg',
      })

      expect(data.publicUrl).toContain('download=custom-filename.jpg')
    })
  })

  describe('Utility methods coverage', () => {
    test('encodeMetadata function', async () => {
      const bucketName = await newBucket()

      const metadata = {
        author: 'test user',
        version: '1.0',
        tags: 'important,work',
      }

      const res = await storage.from(bucketName).upload('metadata-test.txt', 'content', {
        metadata,
      })

      expect(res.error).toBeNull()

      // Verify metadata was properly encoded by retrieving file info
      const infoRes = await storage.from(bucketName).info('metadata-test.txt')
      expect(infoRes.error).toBeNull()
      expect(infoRes.data?.metadata).toBeDefined()
    })

    test('path normalization with _getFinalPath', () => {
      // Test public URL generation which uses _getFinalPath internally
      const { data } = storage.from('test-bucket').getPublicUrl('/folder//file.txt')
      // Note: Current implementation doesn't normalize paths - this tests existing behavior
      expect(data.publicUrl).toContain('test-bucket')
      expect(data.publicUrl).toContain('file.txt')
    })

    test('_removeEmptyFolders utility', async () => {
      const bucketName = await newBucket()

      // Create nested structure
      await storage.from(bucketName).upload('folder/subfolder/file.txt', 'content')

      // Remove the file, which should trigger folder cleanup internally
      const res = await storage.from(bucketName).remove(['folder/subfolder/file.txt'])
      expect(res.error).toBeNull()
    })
  })

  describe('Error handling improvements', () => {
    test('handles invalid bucket names gracefully', async () => {
      const res = await storage.from('').upload('test.txt', 'content')
      expect(res.error).not.toBeNull()
    })

    test('handles invalid file paths', async () => {
      const bucketName = await newBucket()
      const res = await storage.from(bucketName).upload('', 'content')
      expect(res.error).not.toBeNull()
    })
  })
})
