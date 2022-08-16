export interface Bucket {
  id: string
  name: string
  owner: string
  created_at: string
  updated_at: string
  public: boolean
}

export interface FileObject {
  name: string
  bucket_id: string
  owner: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
  buckets: Bucket
}

export interface SortBy {
  column?: string
  order?: string
}

export interface FileOptions {
  /**
   * the `Cache-Control: max-age=<seconds>` seconds value.
   */
  cacheControl?: string
  /**
   * the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   */
  contentType?: string
  /**
   * whether to perform an upsert
   */
  upsert?: boolean
}

export interface SearchOptions {
  /**
   *  The number of files you want to be returned.
   */
  limit?: number

  /**
   * The starting position.
   */
  offset?: number

  /**
   * The column to sort by. Can be any column inside a FileObject.
   */
  sortBy?: SortBy

  /**
   * The search string to filter files by.
   */
  search?: string
}

export interface FetchParameters {
  /**
   * Pass in an AbortController's signal to cancel the request.
   */
  signal?: AbortSignal
}

// TODO: need to check for metadata props. The api swagger doesnt have.
export interface Metadata {
  name: string
}
