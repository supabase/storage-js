export class StorageApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'StorageApiError'
    this.status = status
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
    }
  }
}
