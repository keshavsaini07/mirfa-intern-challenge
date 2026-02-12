import {
  EncryptRequestType,
  StatusResponseType,
  TxnDecryptResponseType,
  TxnSecureRecordType,
} from "../utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWrapper<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}

export async function encryptTx(data: EncryptRequestType) {
  const res = await fetch(`${BASE_URL}/tx/encrypt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Encryption failed");
  }

  return res.json();
}

export async function getTx(id: string): Promise<TxnSecureRecordType> {
  return fetchWrapper(`${BASE_URL}/tx/${id}`);
}

export async function decryptTx(id: string): Promise<TxnDecryptResponseType> {
  return fetchWrapper(`${BASE_URL}/tx/${id}/decrypt`, {
    method: "POST",
  });
}

export async function checkStatus(): Promise<StatusResponseType> {
  return fetchWrapper(`${BASE_URL}/status`);
}
