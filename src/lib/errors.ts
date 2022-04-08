export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export class StorageApiError extends StorageError {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'StorageApiError'
    this.status = status
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
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
