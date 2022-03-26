# `storage-js`

JS Client library to interact with Supabase Storage.

- Documentation: https://supabase.io/docs/reference/javascript/storage-createbucket

## Quick Start Guide

### Installing the module

```bash
npm install @supabase/storage-js
```

### Connecting to the storage backend

```js
import { SupabaseStorageClient } from '@supabase/storage-js'

const STORAGE_URL = 'https://<project_ref>.supabase.co/storage/v1'
const SERVICE_KEY = '<service_role>' //! service key, not anon key

const storageClient = new SupabaseStorageClient(STORAGE_URL, {
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

- Updates a new Storage bucket:

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

- Deletes an existing bucket (a bucket can't be deleted with existing objects inside it):

  ```js
  const { data, error } = await storageClient.deleteBucket('test_bucket')
  ```

- Retrieve the details of all Storage buckets within an existing project:

  ```js
  const { data, error } = await storageClient.listBuckets()
  ```

#### Handling Files

- Uploads a file to an existing bucket:

  ```js
  const bucket_name = "your-bucket-name-here";
  const path = "/path/to/file.png";
  const fileOptions = {
          cacheControl: '3600',
    upsert: false
  };
  const fileBody = ...; // load your png file here

  const { data, error } = await storageClient.from(bucket_name).upload(path, fileBody, fileOptions);
  ```

  > For more details on the `fileOptions` fields and the acceptable data types for the `fileBody`, see [the official supabase documentation](https://supabase.com/docs/reference/javascript/storage-from-upload)

- Downloads a file from an exisiting bucket:

  ```js
  const bucket_name = 'your-bucket-name-here'
  const path = '/path/to/file.png'
  const { data, error } = await storageClient.from(bucket_name).download(path)
  ```

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves. Thanks to these sponsors who are making the OSS ecosystem better for everyone.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
