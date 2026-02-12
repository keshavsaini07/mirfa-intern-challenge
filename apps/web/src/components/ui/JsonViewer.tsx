export default function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
