export type EncryptRequestType = {
  partyId: string;
  payload: Record<string, unknown>;
};

export type TxnSecureRecordType = {
  id: string;
  partyId: string;
  createdAt: string;

  payload_nonce: string;
  payload_ct: string;
  payload_tag: string;

  dek_wrap_nonce: string;
  dek_wrapped: string;
  dek_wrap_tag: string;

  alg: "AES-256-GCM";
  mk_version: number;
};

export type TxnDecryptResponseType = Record<string, unknown>;
