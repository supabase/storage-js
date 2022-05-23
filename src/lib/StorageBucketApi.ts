import { DEFAULT_HEADERS } from './constants'
import { Fetch, get, post, put, remove } from './fetch'
import { noopPromise, resolveFetch } from './helpers'
import { Bucket } from './types'

export class StorageBucketApi {
  protected url: string
  protected getHeaders: () => Promise<{ [key: string]: string }> | { [key: string]: string }
  protected fetch: Fetch

  constructor(
    url: string,
    getHeaders: () => Promise<{ [key: string]: string }> | { [key: string]: string } = noopPromise,
    fetch?: Fetch
  ) {
    this.url = url
    this.getHeaders = async () => {
      const headers = await Promise.resolve(getHeaders())

      return { ...DEFAULT_HEADERS, ...headers }
    }
    this.fetch = resolveFetch(fetch)
  }

  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  async listBuckets(): Promise<{ data: Bucket[] | null; error: Error | null }> {
    try {
      const data = await get(this.fetch, `${this.url}/bucket`, { headers: await this.getHeaders() })
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  async getBucket(id: string): Promise<{ data: Bucket | null; error: Error | null }> {
    try {
      const data = await get(this.fetch, `${this.url}/bucket/${id}`, {
        headers: await this.getHeaders(),
      })
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @returns newly created bucket id
   */
  async createBucket(
    id: string,
    options: { public: boolean } = { public: false }
  ): Promise<{ data: string | null; error: Error | null }> {
    try {
      const data = await post(
        this.fetch,
        `${this.url}/bucket`,
        { id, name: id, public: options.public },
        { headers: await this.getHeaders() }
      )
      return { data: data.name, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  /**
   * Updates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   */
  async updateBucket(
    id: string,
    options: { public: boolean }
  ): Promise<{ data: { message: string } | null; error: Error | null }> {
    try {
      const data = await put(
        this.fetch,
        `${this.url}/bucket/${id}`,
        { id, name: id, public: options.public },
        { headers: await this.getHeaders() }
      )
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  async emptyBucket(
    id: string
  ): Promise<{ data: { message: string } | null; error: Error | null }> {
    try {
      const data = await post(
        this.fetch,
        `${this.url}/bucket/${id}/empty`,
        {},
        { headers: await this.getHeaders() }
      )
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  async deleteBucket(
    id: string
  ): Promise<{ data: { message: string } | null; error: Error | null }> {
    try {
      const data = await remove(
        this.fetch,
        `${this.url}/bucket/${id}`,
        {},
        { headers: await this.getHeaders() }
      )
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}
