import { CryptoValidationError } from "./crypto.error";

function isValidHex(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

export function assertHex(str: string, name: string) {
  if (!isValidHex(str)) {
    throw new CryptoValidationError(`${name} is not valid hex`);
  }
}

export function assertLength(buf: Buffer, expected: number, name: string) {
  if (buf.length !== expected) {
    throw new CryptoValidationError(`${name} must be ${expected} bytes`);
  }
}
