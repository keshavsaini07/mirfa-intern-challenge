"use client";

import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import JsonViewer from "../ui/JsonViewer";
import ErrorMessage from "../ui/ErrorMessage";
import { checkStatus } from "../../lib/api";
import { StatusResponseType } from "../../utils";

export default function StatusTab() {
  const [response, setResponse] = useState<StatusResponseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatus = async () => {
    setError(null);
    setResponse(null);

    try {
      setLoading(true);
      const data = await checkStatus();
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

      <PrimaryButton onClick={handleStatus} loading={loading}>
        Check Backend Status
      </PrimaryButton>

      {response && <JsonViewer data={response} />}
    </div>
  );
}
