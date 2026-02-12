"use client";

import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import TextInput from "../ui/TextInput";
import JsonViewer from "../ui/JsonViewer";
import ErrorMessage from "../ui/ErrorMessage";
import { decryptTx } from "../../lib/api";
import { TxnDecryptResponseType } from "../../utils";

export default function DecryptTab() {
  const [id, setId] = useState("");
  const [response, setResponse] = useState<TxnDecryptResponseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    setError(null);
    setResponse(null);

    if (!id.trim()) {
      setError("Transaction ID is required.");
      return;
    }

    try {
      setLoading(true);
      const data = await decryptTx(id);
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

      <TextInput value={id} onChange={setId} placeholder="Transaction ID" />

      <PrimaryButton onClick={handleDecrypt} loading={loading}>
        Decrypt Transaction
      </PrimaryButton>

      {response && <JsonViewer data={response} />}
    </div>
  );
}
