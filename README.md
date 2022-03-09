# `storage-js`

JS Client library to interact with Supabase Storage.

- Documentation: https://supabase.io/docs/reference/javascript/storage-createbucket

## Quick Start Guide

### Installing the module

``` bash
npm install @supabase/storage-js
```

### Connecting to the storage backend

``` js
import { SupabaseStorageClient } from '@supabase/storage-js'

const STORAGE_URL = "https://<project_ref>.supabase.co/storage/v1";
const SERVICE_KEY = "<service_role>"; //! service key, not anon key

const storage_client = new SupabaseStorageClient(
  STORAGE_URL,
    {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
    }
);
```

### Handling resources

- Create a new Storage bucket

    ``` js
    const { data, error } = await storage_client.createBucket("test_bucket", { public: false });
    ```

- Retrieve the details of an existing Storage bucke

    ``` js
    const { data, error } = await storage_client.getBucket("test_bucket");
    ```

- Updates a new Storage bucket

    ``` js
    const { data, error } = await storage_client.createBucket("test_bucket", { public: true });
    ```

- Remove all objects inside a single bucket

    ``` js
    const { data, error } = await storage_client.getBucket("test_bucket");
    ```

- Deletes an existing bucket (a bucket can't be deleted with existing objects inside it):

    ``` js
    const { data, error } = await storage_client.deleteBucket("test_bucket");
    ```

- Retrieve the details of all Storage buckets within an existing product:

    ``` js
    const { data, error } = await storage_client.listBuckets();
    ```

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves. Thanks to these sponsors who are making the OSS ecosystem better for everyone.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
