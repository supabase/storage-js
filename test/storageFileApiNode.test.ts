/**
 * @jest-environment node
 */

import { createJWTStorageClient } from './config'
import * as path from 'path'
import * as fs from 'fs'

const storage = createJWTStorageClient()

const newBucket = async (isPublic = true, prefix = '') => {
  const bucketName = `${prefix ? prefix + '-' : ''}bucket-${Date.now()}`
  await storage.createBucket(bucketName, { public: isPublic })
  return bucketName
}

const uploadFilePath = (fileName: string) => path.resolve(__dirname, 'fixtures', 'upload', fileName)

describe('Object API', () => {
  let bucketName: string
  beforeEach(async () => {
    bucketName = await newBucket()
  })

  describe('Stream handling in node', () => {
    test('uploading stream with duplex option', async () => {
      const file = await fs.createReadStream(uploadFilePath('file.txt'))
      const uploadPathWithDuplex = `testpath/file-duplex-${Date.now()}.txt`

      const res = await storage.from(bucketName).upload(uploadPathWithDuplex, file, {
        duplex: 'half',
      })
      expect(res.error).toBeNull()
      expect(res.data?.path).toEqual(uploadPathWithDuplex)
    })
  })
})
