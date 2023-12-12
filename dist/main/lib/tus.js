'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.TusUploader = exports.TerminateError = exports.isTusJSAvailable = exports.getTusJsPeerDep = void 0
const errors_1 = require('./errors')
function getTusJsPeerDep() {
  try {
    // @ts-ignore potentially the library is not installed
    const tusJS = require('tus-js-client')
    // @ts-ignore potentially the library is not installed
    return tusJS
  } catch (e) {
    return
  }
}
exports.getTusJsPeerDep = getTusJsPeerDep
function isTusJSAvailable() {
  return Boolean(getTusJsPeerDep())
}
exports.isTusJSAvailable = isTusJSAvailable
class TerminateError extends Error {}
exports.TerminateError = TerminateError
class TusUploader {
  constructor(url, bucketId, path, file, options) {
    this.url = url
    this.bucketId = bucketId
    this.path = path
    this.file = file
    this.options = options
    this.inProgress = false
    this.uploadResource = this.prepareUpload()
  }
  abort() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.uploadResource.abort(true)
      this.inProgress = false
    })
  }
  pause() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.uploadResource.abort(false)
      this.inProgress = false
    })
  }
  listPreviousUploads() {
    return this.uploadResource.findPreviousUploads()
  }
  clearAllPreviousUploads() {
    return __awaiter(this, void 0, void 0, function* () {
      const tusJs = getTusJsPeerDep()
      if (!tusJs) {
        throw new Error('tus-js-client not installed install with: npm install tus-js-client')
      }
      const previousUploads = yield this.uploadResource.findPreviousUploads()
      return Promise.all(previousUploads.map((upload) => tusJs.Upload.terminate(upload.uploadUrl)))
    })
  }
  startOrResume(index = 0) {
    return __awaiter(this, void 0, void 0, function* () {
      const previousUploads = yield this.uploadResource.findPreviousUploads()
      if (previousUploads.length) {
        this.uploadResource.resumeFromPreviousUpload(previousUploads[index])
      }
      return this.start()
    })
  }
  start() {
    if (this.inProgress) {
      console.warn('an upload is already in progress for this resource')
      return
    }
    this.inProgress = true
    this.uploadResource.start()
  }
  prepareUpload() {
    var _a
    const tusJs = getTusJsPeerDep()
    if (!tusJs) {
      throw new Error('tus-js-client not installed install with: npm install tus-js-client')
    }
    const options = this.options
    const file = this.file
    const url = this.url
    const bucketId = this.bucketId
    const path = this.path
    const headers = {}
    let fileBody = this.file
    let contentType = ''
    let cacheControl = ''
    if (options === null || options === void 0 ? void 0 : options.upsert) {
      headers['x-upsert'] = 'true'
    }
    if (file instanceof FormData) {
      fileBody = file.get(
        (options === null || options === void 0 ? void 0 : options.formDataFileKey) || 'file'
      )
      contentType = file.get('contentType') || ''
      cacheControl = file.get('cacheControl') || ''
    }
    return new tusJs.Upload(
      fileBody,
      Object.assign(
        {
          endpoint: `${url}/upload/resumable`,
          retryDelays: [0, 200, 500, 1000, 2000],
          removeFingerprintOnSuccess: true,
          storeFingerprintForResuming: true,
          headers: headers,
          onBeforeRequest: (req) =>
            __awaiter(this, void 0, void 0, function* () {
              var _b
              const authHeader = yield (_b = options.authorization) === null || _b === void 0
                ? void 0
                : _b.call(options)
              if (authHeader) {
                req.setHeader('authorization', authHeader)
              }
            }),
          chunkSize: 6 * 1024 * 1024,
          metadata: {
            bucketName: bucketId,
            objectName: path,
            contentType:
              contentType ||
              (options === null || options === void 0 ? void 0 : options.contentType) ||
              'text/plain;charset=UTF-8',
            cacheControl:
              cacheControl ||
              ((_a = options === null || options === void 0 ? void 0 : options.cacheControl) ===
                null || _a === void 0
                ? void 0
                : _a.toString()) ||
              '3600',
          },
          onError: (error) => {
            var _a, _b, _c, _d
            this.inProgress = false
            if ('originalResponse' in error) {
              ;(_a = options === null || options === void 0 ? void 0 : options.onError) === null ||
              _a === void 0
                ? void 0
                : _a.call(options, {
                    data: null,
                    error: new errors_1.StorageApiError(
                      ((_b = error.originalResponse) === null || _b === void 0
                        ? void 0
                        : _b.getBody()) || error.message,
                      ((_c = error.originalResponse) === null || _c === void 0
                        ? void 0
                        : _c.getStatus()) || 500
                    ),
                  })
            } else {
              ;(_d = options === null || options === void 0 ? void 0 : options.onError) === null ||
              _d === void 0
                ? void 0
                : _d.call(options, {
                    data: null,
                    error: new errors_1.StorageApiError(error.message, 500),
                  })
            }
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            var _a
            const percentage = (bytesUploaded / bytesTotal) * 100
            ;(_a = options === null || options === void 0 ? void 0 : options.onProgress) === null ||
            _a === void 0
              ? void 0
              : _a.call(options, percentage, bytesUploaded, bytesTotal)
          },
          onSuccess: () => {
            this.inProgress = false
            options.onSuccess({ data: { path: path }, error: null })
          },
        },
        (options === null || options === void 0 ? void 0 : options.tusOptions) || {}
      )
    )
  }
}
exports.TusUploader = TusUploader
//# sourceMappingURL=tus.js.map
