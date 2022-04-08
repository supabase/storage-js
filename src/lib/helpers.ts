import crossFetch, { Response as CrossFetchResponse } from 'cross-fetch'

type Fetch = typeof fetch

export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (crossFetch as unknown) as Fetch
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
