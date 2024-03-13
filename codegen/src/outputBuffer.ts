export class OutputBuffer {
  public readonly name: string;
  private buffer: string;

  constructor(name: string) {
    this.name = name;
    this.buffer = '';
  }

  writeLine(line: string) {
    this.buffer += line + '\n';
  }

  toString() {
    return this.buffer;
  }
}