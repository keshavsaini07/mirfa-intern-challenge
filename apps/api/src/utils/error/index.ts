export class CryptoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CryptoValidationError";
  }
}

export class DecryptionError extends Error {
  constructor() {
    super("Decryption failed");
    this.name = "DecryptionError";
  }
}
