import { StorageApiError, StorageUnknownError } from './errors'
import { resolveResponse } from './helpers'
import { FetchParameters } from './types'

export type Fetch = typeof fetch

export interface FetchOptions {
  headers?: {
    [key: string]: string
  }
  noResolveJson?: boolean
}

export type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'

const _getErrorMessage = (err: any): string =>
  err.msg || err.message || err.error_description || err.error || JSON.stringify(err)

const handleError = async (error: unknown, reject: (reason?: any) => void) => {
  const Res = await resolveResponse()

  if (error instanceof Res) {
    error
      .json()
      .then((err) => {
        reject(new StorageApiError(_getErrorMessage(err), error.status || 500))
      })
      .catch((err) => {
        reject(new StorageUnknownError(_getErrorMessage(err), err))
      })
  } else {
    reject(new StorageUnknownError(_getErrorMessage(error), error))
  }
}

const _getRequestParams = (
  method: RequestMethodType,
  options?: FetchOptions,
  parameters?: FetchParameters,
  body?: object
) => {
  const params: { [k: string]: any } = { method, headers: options?.headers || {} }

  if (method === 'GET') {
    return params
  }

  params.headers = { 'Content-Type': 'application/json', ...options?.headers }
  params.body = JSON.stringify(body)
  return { ...params, ...parameters }
}

async function _handleRequest(
  fetcher: Fetch,
  method: RequestMethodType,
  url: string,
  options?: FetchOptions,
  parameters?: FetchParameters,
  body?: object
): Promise<any> {
  return new Promise((resolve, reject) => {
    fetcher(url, _getRequestParams(method, options, parameters, body))
      .then(async (result) => {
        if (!result.ok) throw result;
        // Check content type of response
        const contentType = result.headers.get('content-type');
        // If the content type is JSON, parse the response as text and then parse that as JSON
        if (contentType?.includes('application/json')) {
          const resultText = await result.text();
          resolve(options?.noResolveJson ? result : JSON.parse(resultText));
        }
        // If not JSON, check for options.noResolveJson. It either returns the blob result if set true or the parsed text
        else if (options?.noResolveJson) {
          resolve(result);
        }
        else {
          const resultText = await result.text();
          resolve(resultText);
        }
      })
      .catch((error) => handleError(error, reject));
  });
}

export async function get(
  fetcher: Fetch,
  url: string,
  options?: FetchOptions,
  parameters?: FetchParameters
): Promise<any> {
  return _handleRequest(fetcher, 'GET', url, options, parameters)
}

export async function post(
  fetcher: Fetch,
  url: string,
  body: object,
  options?: FetchOptions,
  parameters?: FetchParameters
): Promise<any> {
  return _handleRequest(fetcher, 'POST', url, options, parameters, body)
}

export async function put(
  fetcher: Fetch,
  url: string,
  body: object,
  options?: FetchOptions,
  parameters?: FetchParameters
): Promise<any> {
  return _handleRequest(fetcher, 'PUT', url, options, parameters, body)
}

export async function remove(
  fetcher: Fetch,
  url: string,
  body: object,
  options?: FetchOptions,
  parameters?: FetchParameters
): Promise<any> {
  return _handleRequest(fetcher, 'DELETE', url, options, parameters, body)
}
