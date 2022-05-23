import { StorageBucketApi, StorageFileApi } from './lib'
import { Fetch } from './lib/fetch'
import { noopPromise } from './lib/helpers'

export class StorageClient extends StorageBucketApi {
  constructor(
    url: string,
    getHeaders: () => Promise<{ [key: string]: string }> | { [key: string]: string } = noopPromise,
    fetch?: Fetch
  ) {
    super(url, getHeaders, fetch)
  }

  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id: string): StorageFileApi {
    return new StorageFileApi(this.url, this.getHeaders, id, this.fetch)
  }
}
