"use client";

import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import TextInput from "../ui/TextInput";
import JsonViewer from "../ui/JsonViewer";
import ErrorMessage from "../ui/ErrorMessage";
import { getTx } from "../../lib/api";
import { TxnSecureRecordType } from "../../utils";

export default function ViewTab() {
  const [id, setId] = useState("");
  const [response, setResponse] = useState<TxnSecureRecordType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleView = async () => {
    setError(null);
    setResponse(null);

    if (!id.trim()) {
      setError("Transaction ID is required.");
      return;
    }

    try {
      setLoading(true);
      const data = await getTx(id);
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

      <PrimaryButton onClick={handleView} loading={loading}>
        Get Encrypted Transaction
      </PrimaryButton>

      {response && (
        <div>
          <span>Encrypted Payload:</span>
          <JsonViewer data={response} />
        </div>
      )}
    </div>
  );
}
