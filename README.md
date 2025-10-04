# ⚠️ REPOSITORY DEPRECATED - MOVED TO MONOREPO

> **🚨 This repository has been moved and will be archived on October 10, 2025**
>
> **All development has moved to the [Supabase JS Monorepo](https://github.com/supabase/supabase-js)**
>
> **If you're looking for the README of `storage-js`, you can find it at:**  
> **https://github.com/supabase/supabase-js/tree/master/packages/core/storage-js**
>
> ### What happened?
>
> This repository was merged into the main Supabase JS monorepo for better coordination, testing, and releases.
>
> ### What you need to do:
>
> - **📖 For documentation**: Visit the [new storage-js location](https://github.com/supabase/supabase-js/tree/master/packages/core/storage-js)
> - **🐛 For issues**: Create them in the [supabase-js repository](https://github.com/supabase/supabase-js/issues)
> - **🔧 For contributions**: See the [Contributing Guide](https://github.com/supabase/supabase-js/blob/master/CONTRIBUTING.md)
> - **📚 For migration help**: Read the [Migration Guide](https://github.com/supabase/supabase-js/blob/master/docs/MIGRATION.md)
>
> ### If you have open work:
>
> - **Uncommitted changes**: Manually transport your work to the monorepo (file structure is the same under `packages/core/storage-js/`)
> - **Open PRs**: Tag a maintainer in your PR and we'll help you migrate it
> - **Issues**: Will be transported to the supabase-js repository
>
> **⚠️ This is the old repository. Please use the [supabase-js monorepo](https://github.com/supabase/supabase-js) going forward.**

---

# `storage-js` (DEPRECATED - USE MONOREPO)

<div align="center">

[![pkg.pr.new](https://pkg.pr.new/badge/supabase/storage-js)](https://pkg.pr.new/~/supabase/storage-js)

</div>

JS Client library to interact with Supabase Storage.

- Documentation: https://supabase.io/docs/reference/javascript/storage-createbucket

## Quick Start Guide

### Installing the module

```bash
npm install @supabase/storage-js
```

### Connecting to the storage backend

```js
import { StorageClient } from '@supabase/storage-js'

const STORAGE_URL = 'https://<project_ref>.supabase.co/storage/v1'
const SERVICE_KEY = '<service_role>' //! service key, not anon key

const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
})
```

### Handling resources

#### Handling Storage Buckets

- Create a new Storage bucket:

  ```js
  const { data, error } = await storageClient.createBucket(
    'test_bucket', // Bucket name (must be unique)
    { public: false } // Bucket options
  )
  ```

- Retrieve the details of an existing Storage bucket:

  ```js
  const { data, error } = await storageClient.getBucket('test_bucket')
  ```

- Update a new Storage bucket:

  ```js
  const { data, error } = await storageClient.updateBucket(
    'test_bucket', // Bucket name
    { public: false } // Bucket options
  )
  ```

- Remove all objects inside a single bucket:

  ```js
  const { data, error } = await storageClient.emptyBucket('test_bucket')
  ```

- Delete an existing bucket (a bucket can't be deleted with existing objects inside it):

  ```js
  const { data, error } = await storageClient.deleteBucket('test_bucket')
  ```

- Retrieve the details of all Storage buckets within an existing project:

  ```js
  const { data, error } = await storageClient.listBuckets()
  ```

#### Handling Files

- Upload a file to an existing bucket:

  ```js
  const fileBody = ... // load your file here

  const { data, error } = await storageClient.from('bucket').upload('path/to/file', fileBody)
  ```

  > Note:  
  > The path in `data.Key` is prefixed by the bucket ID and is not the value which should be passed to the `download` method in order to fetch the file.  
  > To fetch the file via the `download` method, use `data.path` and `data.bucketId` as follows:
  >
  > ```javascript
  > const { data, error } = await storageClient.from('bucket').upload('/folder/file.txt', fileBody)
  > // check for errors
  > const { data2, error2 } = await storageClient.from(data.bucketId).download(data.path)
  > ```

  > Note: The `upload` method also accepts a map of optional parameters. For a complete list see the [Supabase API reference](https://supabase.com/docs/reference/javascript/storage-from-upload).

- Download a file from an exisiting bucket:

  ```js
  const { data, error } = await storageClient.from('bucket').download('path/to/file')
  ```

- List all the files within a bucket:

  ```js
  const { data, error } = await storageClient.from('bucket').list('folder')
  ```

  > Note: The `list` method also accepts a map of optional parameters. For a complete list see the [Supabase API reference](https://supabase.com/docs/reference/javascript/storage-from-list).

- Replace an existing file at the specified path with a new one:

  ```js
  const fileBody = ... // load your file here

  const { data, error } = await storageClient
    .from('bucket')
    .update('path/to/file', fileBody)
  ```

  > Note: The `upload` method also accepts a map of optional parameters. For a complete list see the [Supabase API reference](https://supabase.com/docs/reference/javascript/storage-from-upload).

- Move an existing file:

  ```js
  const { data, error } = await storageClient
    .from('bucket')
    .move('old/path/to/file', 'new/path/to/file')
  ```

- Delete files within the same bucket:

  ```js
  const { data, error } = await storageClient.from('bucket').remove(['path/to/file'])
  ```

- Create signed URL to download file without requiring permissions:

  ```js
  const expireIn = 60

  const { data, error } = await storageClient
    .from('bucket')
    .createSignedUrl('path/to/file', expireIn)
  ```

- Retrieve URLs for assets in public buckets:

  ```js
  const { data, error } = await storageClient.from('public-bucket').getPublicUrl('path/to/file')
  ```

- Check if a file exists:

  ```js
  const { data, error } = await storageClient.from('bucket').exists('path/to/file')
  // data will be true if the file exists, false otherwise
  ```

### Error Handling

Supplying `.throwOnError()` will throw errors instead of returning them as a property on the response object.

```js
try {
  const { data } = await storageClient.from('bucket').throwOnError().download('path/to/file')
} catch (error) {
  console.error(error)
}
```

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves. Thanks to these sponsors who are making the OSS ecosystem better for everyone.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
