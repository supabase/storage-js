!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(
        (function () {
          try {
            return require('tus-js-client')
          } catch (e) {}
        })()
      ))
    : 'function' == typeof define && define.amd
    ? define(['tus-js-client'], t)
    : 'object' == typeof exports
    ? (exports.supabase = t(
        (function () {
          try {
            return require('tus-js-client')
          } catch (e) {}
        })()
      ))
    : (e.supabase = t(e['tus-js-client']))
})(self, (e) =>
  (() => {
    var t = {
        274: function (e, t, r) {
          'use strict'
          var o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.StorageClient = void 0)
          const n = o(r(981)),
            i = o(r(436))
          class s extends i.default {
            constructor(e, t = {}, r) {
              super(e, t, r)
            }
            from(e) {
              return new n.default(this.url, this.headers, e, this.fetch)
            }
          }
          t.StorageClient = s
        },
        341: function (e, t, r) {
          'use strict'
          var o =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, o) {
                    void 0 === o && (o = r)
                    var n = Object.getOwnPropertyDescriptor(t, r)
                    ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                      (n = {
                        enumerable: !0,
                        get: function () {
                          return t[r]
                        },
                      }),
                      Object.defineProperty(e, o, n)
                  }
                : function (e, t, r, o) {
                    void 0 === o && (o = r), (e[o] = t[r])
                  }),
            n =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
              }
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.StorageClient = void 0)
          var i = r(274)
          Object.defineProperty(t, 'StorageClient', {
            enumerable: !0,
            get: function () {
              return i.StorageClient
            },
          }),
            n(r(717), t),
            n(r(752), t)
        },
        678: (e, t, r) => {
          'use strict'
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.DEFAULT_HEADERS = void 0)
          const o = r(506)
          t.DEFAULT_HEADERS = { 'X-Client-Info': `storage-js/${o.version}` }
        },
        752: (e, t) => {
          'use strict'
          Object.defineProperty(t, '__esModule', { value: !0 }),
            (t.StorageUnknownError = t.StorageApiError = t.isStorageError = t.StorageError = void 0)
          class r extends Error {
            constructor(e) {
              super(e), (this.__isStorageError = !0), (this.name = 'StorageError')
            }
          }
          ;(t.StorageError = r),
            (t.isStorageError = function (e) {
              return 'object' == typeof e && null !== e && '__isStorageError' in e
            }),
            (t.StorageApiError = class extends r {
              constructor(e, t) {
                super(e), (this.name = 'StorageApiError'), (this.status = t)
              }
              toJSON() {
                return { name: this.name, message: this.message, status: this.status }
              }
            }),
            (t.StorageUnknownError = class extends r {
              constructor(e, t) {
                super(e), (this.name = 'StorageUnknownError'), (this.originalError = t)
              }
            })
        },
        716: function (e, t, r) {
          'use strict'
          var o =
            (this && this.__awaiter) ||
            function (e, t, r, o) {
              return new (r || (r = Promise))(function (n, i) {
                function s(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(s, a)
                }
                u((o = o.apply(e, t || [])).next())
              })
            }
          Object.defineProperty(t, '__esModule', { value: !0 }),
            (t.remove = t.put = t.post = t.get = void 0)
          const n = r(752),
            i = r(610),
            s = (e) => e.msg || e.message || e.error_description || e.error || JSON.stringify(e)
          function a(e, t, r, a, u, l) {
            return o(this, void 0, void 0, function* () {
              return new Promise((c, d) => {
                e(
                  r,
                  ((e, t, r, o) => {
                    const n = { method: e, headers: (null == t ? void 0 : t.headers) || {} }
                    return 'GET' === e
                      ? n
                      : ((n.headers = Object.assign(
                          { 'Content-Type': 'application/json' },
                          null == t ? void 0 : t.headers
                        )),
                        (n.body = JSON.stringify(o)),
                        Object.assign(Object.assign({}, n), r))
                  })(t, a, u, l)
                )
                  .then((e) => {
                    if (!e.ok) throw e
                    return (null == a ? void 0 : a.noResolveJson) ? e : e.json()
                  })
                  .then((e) => c(e))
                  .catch((e) =>
                    ((e, t) =>
                      o(void 0, void 0, void 0, function* () {
                        const r = yield (0, i.resolveResponse)()
                        e instanceof r
                          ? e
                              .json()
                              .then((r) => {
                                t(new n.StorageApiError(s(r), e.status || 500))
                              })
                              .catch((e) => {
                                t(new n.StorageUnknownError(s(e), e))
                              })
                          : t(new n.StorageUnknownError(s(e), e))
                      }))(e, d)
                  )
              })
            })
          }
          ;(t.get = function (e, t, r, n) {
            return o(this, void 0, void 0, function* () {
              return a(e, 'GET', t, r, n)
            })
          }),
            (t.post = function (e, t, r, n, i) {
              return o(this, void 0, void 0, function* () {
                return a(e, 'POST', t, n, i, r)
              })
            }),
            (t.put = function (e, t, r, n, i) {
              return o(this, void 0, void 0, function* () {
                return a(e, 'PUT', t, n, i, r)
              })
            }),
            (t.remove = function (e, t, r, n, i) {
              return o(this, void 0, void 0, function* () {
                return a(e, 'DELETE', t, n, i, r)
              })
            })
        },
        610: function (e, t, r) {
          'use strict'
          var o =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, o) {
                    void 0 === o && (o = r)
                    var n = Object.getOwnPropertyDescriptor(t, r)
                    ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                      (n = {
                        enumerable: !0,
                        get: function () {
                          return t[r]
                        },
                      }),
                      Object.defineProperty(e, o, n)
                  }
                : function (e, t, r, o) {
                    void 0 === o && (o = r), (e[o] = t[r])
                  }),
            n =
              (this && this.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, 'default', { enumerable: !0, value: t })
                  }
                : function (e, t) {
                    e.default = t
                  }),
            i =
              (this && this.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e
                var t = {}
                if (null != e)
                  for (var r in e)
                    'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && o(t, e, r)
                return n(t, e), t
              },
            s =
              (this && this.__awaiter) ||
              function (e, t, r, o) {
                return new (r || (r = Promise))(function (n, i) {
                  function s(e) {
                    try {
                      u(o.next(e))
                    } catch (e) {
                      i(e)
                    }
                  }
                  function a(e) {
                    try {
                      u(o.throw(e))
                    } catch (e) {
                      i(e)
                    }
                  }
                  function u(e) {
                    var t
                    e.done
                      ? n(e.value)
                      : ((t = e.value),
                        t instanceof r
                          ? t
                          : new r(function (e) {
                              e(t)
                            })).then(s, a)
                  }
                  u((o = o.apply(e, t || [])).next())
                })
              }
          Object.defineProperty(t, '__esModule', { value: !0 }),
            (t.resolveResponse = t.resolveFetch = void 0),
            (t.resolveFetch = (e) => {
              let t
              return (
                (t =
                  e ||
                  ('undefined' == typeof fetch
                    ? (...e) =>
                        Promise.resolve()
                          .then(() => i(r(406)('@supabase/node-fetch')))
                          .then(({ default: t }) => t(...e))
                    : fetch)),
                (...e) => t(...e)
              )
            }),
            (t.resolveResponse = () =>
              s(void 0, void 0, void 0, function* () {
                return 'undefined' == typeof Response
                  ? (yield Promise.resolve().then(() => i(r(406)('@supabase/node-fetch')))).Response
                  : Response
              }))
        },
        965: function (e, t, r) {
          'use strict'
          var o =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, o) {
                    void 0 === o && (o = r)
                    var n = Object.getOwnPropertyDescriptor(t, r)
                    ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                      (n = {
                        enumerable: !0,
                        get: function () {
                          return t[r]
                        },
                      }),
                      Object.defineProperty(e, o, n)
                  }
                : function (e, t, r, o) {
                    void 0 === o && (o = r), (e[o] = t[r])
                  }),
            n =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
              }
          Object.defineProperty(t, '__esModule', { value: !0 }),
            n(r(436), t),
            n(r(981), t),
            n(r(717), t),
            n(r(678), t),
            n(r(1), t)
        },
        1: function (e, t, r) {
          'use strict'
          var o =
            (this && this.__awaiter) ||
            function (e, t, r, o) {
              return new (r || (r = Promise))(function (n, i) {
                function s(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(s, a)
                }
                u((o = o.apply(e, t || [])).next())
              })
            }
          Object.defineProperty(t, '__esModule', { value: !0 }),
            (t.TusUploader = t.TerminateError = t.isTusJSAvailable = t.getTusJsPeerDep = void 0)
          const n = r(752)
          function i() {
            try {
              return r(532)
            } catch (e) {
              return
            }
          }
          ;(t.getTusJsPeerDep = i),
            (t.isTusJSAvailable = function () {
              return Boolean(i())
            })
          class s extends Error {}
          ;(t.TerminateError = s),
            (t.TusUploader = class {
              constructor(e, t, r, o, n) {
                ;(this.url = e),
                  (this.bucketId = t),
                  (this.path = r),
                  (this.file = o),
                  (this.options = n),
                  (this.inProgress = !1),
                  (this.uploadResource = this.prepareUpload())
              }
              abort() {
                return o(this, void 0, void 0, function* () {
                  yield this.uploadResource.abort(!0), (this.inProgress = !1)
                })
              }
              pause() {
                return o(this, void 0, void 0, function* () {
                  yield this.uploadResource.abort(!1), (this.inProgress = !1)
                })
              }
              listPreviousUploads() {
                return this.uploadResource.findPreviousUploads()
              }
              clearAllPreviousUploads() {
                return o(this, void 0, void 0, function* () {
                  const e = i()
                  if (!e)
                    throw new Error(
                      'tus-js-client not installed install with: npm install tus-js-client'
                    )
                  const t = yield this.uploadResource.findPreviousUploads()
                  return Promise.all(t.map((t) => e.Upload.terminate(t.uploadUrl)))
                })
              }
              startOrResume(e = 0) {
                return o(this, void 0, void 0, function* () {
                  const t = yield this.uploadResource.findPreviousUploads()
                  return (
                    t.length && this.uploadResource.resumeFromPreviousUpload(t[e]), this.start()
                  )
                })
              }
              start() {
                this.inProgress
                  ? console.warn('an upload is already in progress for this resource')
                  : ((this.inProgress = !0), this.uploadResource.start())
              }
              prepareUpload() {
                var e
                const t = i()
                if (!t)
                  throw new Error(
                    'tus-js-client not installed install with: npm install tus-js-client'
                  )
                const r = this.options,
                  s = this.file,
                  a = this.url,
                  u = this.bucketId,
                  l = this.path,
                  c = {}
                let d = this.file,
                  h = '',
                  f = ''
                return (
                  (null == r ? void 0 : r.upsert) && (c['x-upsert'] = 'true'),
                  s instanceof FormData &&
                    ((d = s.get((null == r ? void 0 : r.formDataFileKey) || 'file')),
                    (h = s.get('contentType') || ''),
                    (f = s.get('cacheControl') || '')),
                  new t.Upload(
                    d,
                    Object.assign(
                      {
                        endpoint: `${a}/upload/resumable`,
                        retryDelays: [0, 200, 500, 1e3, 2e3],
                        removeFingerprintOnSuccess: !0,
                        storeFingerprintForResuming: !0,
                        headers: c,
                        onBeforeRequest: (e) =>
                          o(this, void 0, void 0, function* () {
                            var t
                            const o = yield null === (t = r.authorization) || void 0 === t
                              ? void 0
                              : t.call(r)
                            o && e.setHeader('authorization', o)
                          }),
                        chunkSize: 6291456,
                        metadata: {
                          bucketName: u,
                          objectName: l,
                          contentType:
                            h || (null == r ? void 0 : r.contentType) || 'text/plain;charset=UTF-8',
                          cacheControl:
                            f ||
                            (null === (e = null == r ? void 0 : r.cacheControl) || void 0 === e
                              ? void 0
                              : e.toString()) ||
                            '3600',
                        },
                        onError: (e) => {
                          var t, o, i, s
                          ;(this.inProgress = !1),
                            'originalResponse' in e
                              ? null === (t = null == r ? void 0 : r.onError) ||
                                void 0 === t ||
                                t.call(r, {
                                  data: null,
                                  error: new n.StorageApiError(
                                    (null === (o = e.originalResponse) || void 0 === o
                                      ? void 0
                                      : o.getBody()) || e.message,
                                    (null === (i = e.originalResponse) || void 0 === i
                                      ? void 0
                                      : i.getStatus()) || 500
                                  ),
                                })
                              : null === (s = null == r ? void 0 : r.onError) ||
                                void 0 === s ||
                                s.call(r, {
                                  data: null,
                                  error: new n.StorageApiError(e.message, 500),
                                })
                        },
                        onProgress: (e, t) => {
                          var o
                          const n = (e / t) * 100
                          null === (o = null == r ? void 0 : r.onProgress) ||
                            void 0 === o ||
                            o.call(r, n, e, t)
                        },
                        onSuccess: () => {
                          ;(this.inProgress = !1), r.onSuccess({ data: { path: l }, error: null })
                        },
                      },
                      (null == r ? void 0 : r.tusOptions) || {}
                    )
                  )
                )
              }
            })
        },
        717: (e, t) => {
          'use strict'
          Object.defineProperty(t, '__esModule', { value: !0 })
        },
        506: (e, t) => {
          'use strict'
          Object.defineProperty(t, '__esModule', { value: !0 }),
            (t.version = void 0),
            (t.version = '0.0.0')
        },
        436: function (e, t, r) {
          'use strict'
          var o =
            (this && this.__awaiter) ||
            function (e, t, r, o) {
              return new (r || (r = Promise))(function (n, i) {
                function s(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(s, a)
                }
                u((o = o.apply(e, t || [])).next())
              })
            }
          Object.defineProperty(t, '__esModule', { value: !0 })
          const n = r(678),
            i = r(752),
            s = r(716),
            a = r(610)
          t.default = class {
            constructor(e, t = {}, r) {
              ;(this.url = e),
                (this.headers = Object.assign(Object.assign({}, n.DEFAULT_HEADERS), t)),
                (this.fetch = (0, a.resolveFetch)(r))
            }
            listBuckets() {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.get)(this.fetch, `${this.url}/bucket`, {
                      headers: this.headers,
                    }),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            getBucket(e) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.get)(this.fetch, `${this.url}/bucket/${e}`, {
                      headers: this.headers,
                    }),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            createBucket(e, t = { public: !1 }) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.post)(
                      this.fetch,
                      `${this.url}/bucket`,
                      {
                        id: e,
                        name: e,
                        public: t.public,
                        file_size_limit: t.fileSizeLimit,
                        allowed_mime_types: t.allowedMimeTypes,
                      },
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            updateBucket(e, t) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.put)(
                      this.fetch,
                      `${this.url}/bucket/${e}`,
                      {
                        id: e,
                        name: e,
                        public: t.public,
                        file_size_limit: t.fileSizeLimit,
                        allowed_mime_types: t.allowedMimeTypes,
                      },
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            emptyBucket(e) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.post)(
                      this.fetch,
                      `${this.url}/bucket/${e}/empty`,
                      {},
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            deleteBucket(e) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, s.remove)(
                      this.fetch,
                      `${this.url}/bucket/${e}`,
                      {},
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, i.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
          }
        },
        981: function (e, t, r) {
          'use strict'
          var o =
            (this && this.__awaiter) ||
            function (e, t, r, o) {
              return new (r || (r = Promise))(function (n, i) {
                function s(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(s, a)
                }
                u((o = o.apply(e, t || [])).next())
              })
            }
          Object.defineProperty(t, '__esModule', { value: !0 })
          const n = r(752),
            i = r(716),
            s = r(610),
            a = r(965),
            u = { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } },
            l = { cacheControl: '3600', contentType: 'text/plain;charset=UTF-8', upsert: !1 }
          t.default = class {
            constructor(e, t = {}, r, o, n) {
              ;(this.url = e),
                (this.headers = t),
                (this.bucketId = r),
                (this.fetch = (0, s.resolveFetch)(o)),
                (this.getAccessToken = n)
            }
            uploadOrUpdate(e, t, r, i) {
              return o(this, void 0, void 0, function* () {
                try {
                  let o
                  const n = Object.assign(Object.assign({}, l), i),
                    s = Object.assign(
                      Object.assign({}, this.headers),
                      'POST' === e && { 'x-upsert': String(n.upsert) }
                    )
                  'undefined' != typeof Blob && r instanceof Blob
                    ? ((o = new FormData()),
                      o.append('cacheControl', n.cacheControl),
                      o.append('', r))
                    : 'undefined' != typeof FormData && r instanceof FormData
                    ? ((o = r), o.append('cacheControl', n.cacheControl))
                    : ((o = r),
                      (s['cache-control'] = `max-age=${n.cacheControl}`),
                      (s['content-type'] = n.contentType))
                  const a = this._removeEmptyFolders(t),
                    u = this._getFinalPath(a),
                    c = yield this.fetch(
                      `${this.url}/object/${u}`,
                      Object.assign(
                        { method: e, body: o, headers: s, signal: null == i ? void 0 : i.signal },
                        (null == n ? void 0 : n.duplex) ? { duplex: n.duplex } : {}
                      )
                    ),
                    d = yield c.json()
                  return c.ok
                    ? { data: { path: a, id: d.Id, fullPath: d.Key }, error: null }
                    : { data: null, error: d }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            createResumableUpload(e, t, r) {
              var o, n
              return (
                (null === (o = this.headers) || void 0 === o ? void 0 : o.authorization) ||
                  null === (n = this.headers) ||
                  void 0 === n ||
                  n.Authorization,
                new a.TusUploader(
                  this.url,
                  this.bucketId,
                  e,
                  t,
                  Object.assign({ authorization: this.getAccessToken }, r)
                )
              )
            }
            upload(e, t, r) {
              return o(this, void 0, void 0, function* () {
                return (0, a.isTusJSAvailable)() &&
                  'function' == typeof this.getAccessToken &&
                  !(null == r ? void 0 : r.forceStandardUpload)
                  ? new Promise((o, i) => {
                      var s
                      const a = () => {
                          u.abort(), i(new n.StorageError('Upload Aborted'))
                        },
                        u = this.createResumableUpload(
                          e,
                          t,
                          Object.assign(Object.assign({}, r), {
                            onSuccess: (...e) => {
                              var t
                              null === (t = null == r ? void 0 : r.signal) ||
                                void 0 === t ||
                                t.removeEventListener('abort', a),
                                o(...e)
                            },
                            onError: (...e) => {
                              var t
                              null === (t = null == r ? void 0 : r.signal) ||
                                void 0 === t ||
                                t.removeEventListener('abort', a),
                                o(...e)
                            },
                          })
                        )
                      null === (s = null == r ? void 0 : r.signal) ||
                        void 0 === s ||
                        s.addEventListener('abort', () => {
                          var e
                          ;(
                            null === (e = null == r ? void 0 : r.signal) || void 0 === e
                              ? void 0
                              : e.reason
                          )
                            ? u.abort()
                            : u.pause(),
                            i(new n.StorageError('Upload Aborted'))
                        }),
                        u.startOrResume()
                    })
                  : this.uploadOrUpdate('POST', e, t, r)
              })
            }
            uploadToSignedUrl(e, t, r, i) {
              return o(this, void 0, void 0, function* () {
                const o = this._removeEmptyFolders(e),
                  s = this._getFinalPath(o),
                  a = new URL(this.url + `/object/upload/sign/${s}`)
                a.searchParams.set('token', t)
                try {
                  let e
                  const t = Object.assign({ upsert: l.upsert }, i),
                    n = Object.assign(Object.assign({}, this.headers), {
                      'x-upsert': String(t.upsert),
                    })
                  'undefined' != typeof Blob && r instanceof Blob
                    ? ((e = new FormData()),
                      e.append('cacheControl', t.cacheControl),
                      e.append('', r))
                    : 'undefined' != typeof FormData && r instanceof FormData
                    ? ((e = r), e.append('cacheControl', t.cacheControl))
                    : ((e = r),
                      (n['cache-control'] = `max-age=${t.cacheControl}`),
                      (n['content-type'] = t.contentType))
                  const s = yield this.fetch(a.toString(), { method: 'PUT', body: e, headers: n }),
                    u = yield s.json()
                  return s.ok
                    ? { data: { path: o, fullPath: u.Key }, error: null }
                    : { data: null, error: u }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            createSignedUploadUrl(e) {
              return o(this, void 0, void 0, function* () {
                try {
                  let t = this._getFinalPath(e)
                  const r = yield (0, i.post)(
                      this.fetch,
                      `${this.url}/object/upload/sign/${t}`,
                      {},
                      { headers: this.headers }
                    ),
                    o = new URL(this.url + r.url),
                    s = o.searchParams.get('token')
                  if (!s) throw new n.StorageError('No token returned by API')
                  return { data: { signedUrl: o.toString(), path: e, token: s }, error: null }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            update(e, t, r) {
              return o(this, void 0, void 0, function* () {
                return (0, a.isTusJSAvailable)() && !(null == r ? void 0 : r.forceStandardUpload)
                  ? new Promise((o, i) => {
                      var s
                      const a = () => {
                          u.abort(), i(new n.StorageError('Upload Aborted'))
                        },
                        u = this.createResumableUpload(
                          e,
                          t,
                          Object.assign(Object.assign({}, r), {
                            upsert: !0,
                            onSuccess: (...e) => {
                              var t
                              null === (t = null == r ? void 0 : r.signal) ||
                                void 0 === t ||
                                t.removeEventListener('abort', a),
                                o(...e)
                            },
                            onError: (...e) => {
                              var t
                              null === (t = null == r ? void 0 : r.signal) ||
                                void 0 === t ||
                                t.removeEventListener('abort', a),
                                o(...e)
                            },
                          })
                        )
                      null === (s = null == r ? void 0 : r.signal) ||
                        void 0 === s ||
                        s.addEventListener('abort', () => {
                          var e
                          ;(
                            null === (e = null == r ? void 0 : r.signal) || void 0 === e
                              ? void 0
                              : e.reason
                          )
                            ? u.abort()
                            : u.pause(),
                            i(new n.StorageError('Upload Aborted'))
                        }),
                        u.startOrResume()
                    })
                  : this.uploadOrUpdate('PUT', e, t, r)
              })
            }
            move(e, t) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, i.post)(
                      this.fetch,
                      `${this.url}/object/move`,
                      { bucketId: this.bucketId, sourceKey: e, destinationKey: t },
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            copy(e, t) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: {
                      path: (yield (0, i.post)(
                        this.fetch,
                        `${this.url}/object/copy`,
                        { bucketId: this.bucketId, sourceKey: e, destinationKey: t },
                        { headers: this.headers }
                      )).Key,
                    },
                    error: null,
                  }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            createSignedUrl(e, t, r) {
              return o(this, void 0, void 0, function* () {
                try {
                  let o = this._getFinalPath(e),
                    n = yield (0, i.post)(
                      this.fetch,
                      `${this.url}/object/sign/${o}`,
                      Object.assign(
                        { expiresIn: t },
                        (null == r ? void 0 : r.transform) ? { transform: r.transform } : {}
                      ),
                      { headers: this.headers }
                    )
                  const s = (null == r ? void 0 : r.download)
                    ? `&download=${!0 === r.download ? '' : r.download}`
                    : ''
                  return (
                    (n = { signedUrl: encodeURI(`${this.url}${n.signedURL}${s}`) }),
                    { data: n, error: null }
                  )
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            createSignedUrls(e, t, r) {
              return o(this, void 0, void 0, function* () {
                try {
                  const o = yield (0, i.post)(
                      this.fetch,
                      `${this.url}/object/sign/${this.bucketId}`,
                      { expiresIn: t, paths: e },
                      { headers: this.headers }
                    ),
                    n = (null == r ? void 0 : r.download)
                      ? `&download=${!0 === r.download ? '' : r.download}`
                      : ''
                  return {
                    data: o.map((e) =>
                      Object.assign(Object.assign({}, e), {
                        signedUrl: e.signedURL ? encodeURI(`${this.url}${e.signedURL}${n}`) : null,
                      })
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            download(e, t) {
              return o(this, void 0, void 0, function* () {
                const r =
                    void 0 !== (null == t ? void 0 : t.transform)
                      ? 'render/image/authenticated'
                      : 'object',
                  o = this.transformOptsToQueryString((null == t ? void 0 : t.transform) || {}),
                  s = o ? `?${o}` : ''
                try {
                  const t = this._getFinalPath(e),
                    o = yield (0, i.get)(this.fetch, `${this.url}/${r}/${t}${s}`, {
                      headers: this.headers,
                      noResolveJson: !0,
                    })
                  return { data: yield o.blob(), error: null }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            getPublicUrl(e, t) {
              const r = this._getFinalPath(e),
                o = [],
                n = (null == t ? void 0 : t.download)
                  ? `download=${!0 === t.download ? '' : t.download}`
                  : ''
              '' !== n && o.push(n)
              const i = void 0 !== (null == t ? void 0 : t.transform) ? 'render/image' : 'object',
                s = this.transformOptsToQueryString((null == t ? void 0 : t.transform) || {})
              '' !== s && o.push(s)
              let a = o.join('&')
              return (
                '' !== a && (a = `?${a}`),
                { data: { publicUrl: encodeURI(`${this.url}/${i}/public/${r}${a}`) } }
              )
            }
            remove(e) {
              return o(this, void 0, void 0, function* () {
                try {
                  return {
                    data: yield (0, i.remove)(
                      this.fetch,
                      `${this.url}/object/${this.bucketId}`,
                      { prefixes: e },
                      { headers: this.headers }
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            list(e, t, r) {
              return o(this, void 0, void 0, function* () {
                try {
                  const o = Object.assign(Object.assign(Object.assign({}, u), t), {
                    prefix: e || '',
                  })
                  return {
                    data: yield (0, i.post)(
                      this.fetch,
                      `${this.url}/object/list/${this.bucketId}`,
                      o,
                      { headers: this.headers },
                      r
                    ),
                    error: null,
                  }
                } catch (e) {
                  if ((0, n.isStorageError)(e)) return { data: null, error: e }
                  throw e
                }
              })
            }
            _getFinalPath(e) {
              return `${this.bucketId}/${e}`
            }
            _removeEmptyFolders(e) {
              return e.replace(/^\/|\/$/g, '').replace(/\/+/g, '/')
            }
            transformOptsToQueryString(e) {
              const t = []
              return (
                e.width && t.push(`width=${e.width}`),
                e.height && t.push(`height=${e.height}`),
                e.resize && t.push(`resize=${e.resize}`),
                e.format && t.push(`format=${e.format}`),
                e.quality && t.push(`quality=${e.quality}`),
                t.join('&')
              )
            }
          }
        },
        406: (e) => {
          function t(e) {
            var t = new Error("Cannot find module '" + e + "'")
            throw ((t.code = 'MODULE_NOT_FOUND'), t)
          }
          ;(t.keys = () => []), (t.resolve = t), (t.id = 406), (e.exports = t)
        },
        532: (t) => {
          'use strict'
          if (void 0 === e) {
            var r = new Error("Cannot find module 'tus-js-client'")
            throw ((r.code = 'MODULE_NOT_FOUND'), r)
          }
          t.exports = e
        },
      },
      r = {}
    function o(e) {
      var n = r[e]
      if (void 0 !== n) return n.exports
      var i = (r[e] = { exports: {} })
      return t[e].call(i.exports, i, i.exports, o), i.exports
    }
    return (o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)), o(341)
  })()
)
