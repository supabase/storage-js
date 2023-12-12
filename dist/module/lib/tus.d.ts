import { StorageError } from './errors'
import { FileBody } from './types'
import type { Upload, PreviousUpload } from 'tus-js-client'
export declare function getTusJsPeerDep(): typeof import('tus-js-client') | undefined
export declare function isTusJSAvailable(): boolean
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
  data: {
    path: string
  }
  error: null
}
type ErrorResponse = {
  error: StorageError
  data: null
}
export declare class TerminateError extends Error {}
export declare class TusUploader {
  private readonly url
  private readonly bucketId
  private readonly path
  private readonly file
  private readonly options
  uploadResource: Upload
  inProgress: boolean
  constructor(
    url: string,
    bucketId: string,
    path: string,
    file: FileBody,
    options: TusUploadOptions
  )
  abort(): Promise<void>
  pause(): Promise<void>
  listPreviousUploads(): Promise<PreviousUpload[]>
  clearAllPreviousUploads(): Promise<void[]>
  startOrResume(index?: number): Promise<void>
  start(): void
  protected prepareUpload(): Upload
}
export {}
//# sourceMappingURL=tus.d.ts.map
