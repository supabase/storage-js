import crossFetch, { Response as CrossFetchResponse } from 'cross-fetch'

type Fetch = typeof fetch

export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = async (...args) => await (await import('cross-fetch')).fetch(...args)
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}

export const resolveResponse = () => {
  if (typeof Response === 'undefined') {
    return CrossFetchResponse
  }

  return Response
}
