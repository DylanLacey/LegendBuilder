export class MockServerResponse {
  buffer: any;
  private headers: any;

  write(buffer: any): boolean {
    this.buffer = buffer;
    return true;
  }
  writeHead(statusCode: number, headers?: any): void {
    this.headers = headers;
  }
  getHeader(name: string): string {
    if (!this.headers) {
      return '[no headers]';
    }
    return this.headers[name];
  }
  end() {}
}
