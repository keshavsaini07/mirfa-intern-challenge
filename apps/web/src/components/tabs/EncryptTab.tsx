"use client";

import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import TextInput from "../ui/TextInput";
import JsonViewer from "../ui/JsonViewer";
import ErrorMessage from "../ui/ErrorMessage";
import { encryptTx } from "../../lib/api";
import { TxnSecureRecordType } from "../../utils";

export default function EncryptTab() {
  const [partyId, setPartyId] = useState("");
  const [payload, setPayload] = useState(
    `{\n  "amount": 100,\n  "currency": "AED"\n}`,
  );
  const [response, setResponse] = useState<TxnSecureRecordType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    setError(null);
    setResponse(null);

    if (!partyId.trim()) {
      setError("Party ID is required.");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(payload);
    } catch {
      setError("Invalid JSON payload.");
      return;
    }

    try {
      setLoading(true);
      const data = await encryptTx({ partyId, payload: parsed });
      setResponse(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <TextInput
        value={partyId}
        onChange={setPartyId}
        placeholder="party_123"
      />

      <textarea
        rows={6}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg font-mono text-sm"
      />

      <PrimaryButton onClick={handleEncrypt} loading={loading}>
        Encrypt Transaction
      </PrimaryButton>

      {response && <JsonViewer data={response} />}
    </div>
  );
}
