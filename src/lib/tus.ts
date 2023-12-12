import { StorageApiError, StorageError } from './errors'
import { FileBody } from './types'

// @ts-ignore -- potentially the library is not installed
import type { Upload, DetailedError, PreviousUpload } from 'tus-js-client'

export function getTusJsPeerDep() {
  try {
    // @ts-ignore potentially the library is not installed
    const tusJS = require('tus-js-client')
    // @ts-ignore potentially the library is not installed
    return tusJS as Awaited<typeof import('tus-js-client')>
  } catch (e) {
    return
  }
}

export function isTusJSAvailable() {
  return Boolean(getTusJsPeerDep())
}

export type TusUpload = any extends Upload ? never : Upload
export type TusUploadOptionFallback<Fallback> = TusUpload extends never
  ? Fallback
  : Omit<TusUploadOptions, 'authorization' | 'onSuccess' | 'onError'>

export interface TusUploadOptions {
  upsert?: boolean
  contentType?: string
  onProgress?: (percentage: number, bytesUploaded: number, bytesTotal: number) => void
  onSuccess: (response: SuccessResponse) => void
  onError?: (response: ErrorResponse) => void
  cacheControl?: number
  authorization?: () => Promise<string>
  formDataFileKey?: string
  tusOptions?: Pick<
    TusUpload['options'],
    | 'retryDelays'
    | 'onChunkComplete'
    | 'onShouldRetry'
    | 'onUploadUrlAvailable'
    | 'overridePatchMethod'
    | 'storeFingerprintForResuming'
    | 'removeFingerprintOnSuccess'
    | 'uploadDataDuringCreation'
    | 'urlStorage'
    | 'fileReader'
    | 'httpStack'
    | 'uploadSize'
    | 'fingerprint'
    | 'onAfterResponse'
    | 'onBeforeRequest'
  >
}

type SuccessResponse = {
  data: { path: string }
  error: null
}

type ErrorResponse = {
  error: StorageError
  data: null
}

type Response = SuccessResponse | ErrorResponse

export class TerminateError extends Error {}

export class TusUploader {
  uploadResource: Upload
  inProgress = false

  constructor(
    private readonly url: string,
    private readonly bucketId: string,
    private readonly path: string,
    private readonly file: FileBody,
    private readonly options: TusUploadOptions
  ) {
    this.uploadResource = this.prepareUpload()
  }

  async abort() {
    await this.uploadResource.abort(true)
    this.inProgress = false
  }

  async pause() {
    await this.uploadResource.abort(false)
    this.inProgress = false
  }

  listPreviousUploads() {
    return this.uploadResource.findPreviousUploads()
  }

  async clearAllPreviousUploads() {
    const tusJs = getTusJsPeerDep()
    if (!tusJs) {
      throw new Error('tus-js-client not installed install with: npm install tus-js-client')
    }

    const previousUploads = await this.uploadResource.findPreviousUploads()
    return Promise.all(
      previousUploads.map((upload: PreviousUpload) =>
        tusJs.Upload.terminate((upload as any).uploadUrl)
      )
    )
  }

  async startOrResume(index = 0) {
    const previousUploads = await this.uploadResource.findPreviousUploads()

    if (previousUploads.length) {
      this.uploadResource.resumeFromPreviousUpload(previousUploads[index])
    }
    return this.start()
  }

  start() {
    if (this.inProgress) {
      console.warn('an upload is already in progress for this resource')
      return
    }

    this.inProgress = true
    this.uploadResource.start()
  }

  protected prepareUpload() {
    const tusJs = getTusJsPeerDep()
    if (!tusJs) {
      throw new Error('tus-js-client not installed install with: npm install tus-js-client')
    }

    const options = this.options
    const file = this.file
    const url = this.url
    const bucketId = this.bucketId
    const path = this.path

    const headers: Record<string, string> = {}
    let fileBody = this.file as File | Blob | Pick<ReadableStreamDefaultReader, 'read'>
    let contentType: string = ''
    let cacheControl: string = ''

    if (options?.upsert) {
      headers['x-upsert'] = 'true'
    }

    if (file instanceof FormData) {
      fileBody = file.get(options?.formDataFileKey || 'file') as Blob
      contentType = (file.get('contentType') as string) || ''
      cacheControl = (file.get('cacheControl') as string) || ''
    }

    return new tusJs.Upload(fileBody, {
      endpoint: `${url}/upload/resumable`,
      retryDelays: [0, 200, 500, 1000, 2000],
      removeFingerprintOnSuccess: true,
      storeFingerprintForResuming: true,
      headers: headers,
      onBeforeRequest: async (req) => {
        const authHeader = await options.authorization?.()
        if (authHeader) {
          req.setHeader('authorization', authHeader)
        }
      },
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: bucketId,
        objectName: path,
        contentType: contentType || options?.contentType || 'text/plain;charset=UTF-8',
        cacheControl: cacheControl || options?.cacheControl?.toString() || '3600',
      },
      onError: (error: DetailedError | Error) => {
        this.inProgress = false
        if ('originalResponse' in error) {
          options?.onError?.({
            data: null,
            error: new StorageApiError(
              error.originalResponse?.getBody() || error.message,
              error.originalResponse?.getStatus() || 500
            ),
          })
        } else {
          options?.onError?.({ data: null, error: new StorageApiError(error.message, 500) })
        }
      },
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        const percentage = (bytesUploaded / bytesTotal) * 100
        options?.onProgress?.(percentage, bytesUploaded, bytesTotal)
      },
      onSuccess: () => {
        this.inProgress = false
        options.onSuccess({ data: { path: path }, error: null })
      },
      ...(options?.tusOptions || {}),
    })
  }
}
