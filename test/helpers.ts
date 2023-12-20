import { Readable } from 'stream'

export class SlowReadableStream extends Readable {
  private buffer: Buffer
  private chunkSize: number
  private delay: number
  private position: number
  private isFirstChunk: boolean
  private scheduledRead: boolean

  constructor(buffer: Buffer, chunkSize: number, delay: number) {
    super()
    this.buffer = buffer
    this.chunkSize = chunkSize
    this.delay = delay
    this.position = 0
    this.isFirstChunk = true
    this.scheduledRead = false
  }

  _read(): void {
    if (this.isFirstChunk) {
      this.pushChunk()
      this.isFirstChunk = false
    } else if (!this.scheduledRead) {
      this.scheduledRead = true
      setTimeout(() => {
        this.scheduledRead = false
        this.pushChunk()
      }, this.delay)
    }
  }

  private pushChunk(): void {
    if (this.position >= this.buffer.length) {
      this.push(null) // Signal end of stream
      return
    }

    const chunk = this.buffer.slice(this.position, this.position + this.chunkSize)
    this.push(chunk)
    this.position += this.chunkSize
  }
}
