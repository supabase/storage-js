export class StorageError extends Error {
  protected __isStorageError = true

  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export function isStorageError(error: unknown): error is StorageError {
  return typeof error === 'object' && error !== null && '__isStorageError' in error
}

export class StorageApiError extends StorageError {
  statusCode: string

  constructor(message: string, statusCode: string) {
    super(message)
    this.name = 'StorageApiError'
    this.statusCode = statusCode
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}

export class StorageUnknownError extends StorageError {
  originalError: unknown

  constructor(message: string, originalError: unknown) {
    super(message)
    this.name = 'StorageUnknownError'
    this.originalError = originalError
  }
}
