"use client";

import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import TextInput from "../ui/TextInput";
import JsonViewer from "../ui/JsonViewer";
import ErrorMessage from "../ui/ErrorMessage";
import { encryptTx } from "../../lib/api";
import { TxnSecureRecordType } from "../../utils";
import ClearButton from "../ui/ClearButton";

const defaultPayload = `{\n  "amount": 100,\n  "currency": "AED"\n}`;

export default function EncryptTab() {
  const [partyId, setPartyId] = useState("");
  const [payload, setPayload] = useState(defaultPayload);
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Invalid JSON: ${err.message}`);
      } else {
        setError("Invalid JSON payload.");
      }
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

  const handleClear = () => {
    setError(null);
    setPartyId("");
    setPayload(defaultPayload);
    setResponse(null);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Party ID
        </label>
        <TextInput
          value={partyId}
          onChange={setPartyId}
          placeholder="party_123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          JSON Payload
        </label>
        <textarea
          rows={6}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg font-mono text-sm"
        />
      </div>

      <div className="flex flex-row gap-2 items-center justify-center">
        <PrimaryButton onClick={handleEncrypt} loading={loading}>
          Encrypt Transaction
        </PrimaryButton>
        <ClearButton onClick={handleClear} />
      </div>

      {response && (
        <div>
          <span>Response:</span>
          <JsonViewer data={response} />
        </div>
      )}
    </div>
  );
}
