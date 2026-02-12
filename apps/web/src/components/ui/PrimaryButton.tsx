interface Props {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
}

export default function PrimaryButton({ onClick, loading, children }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-green-500 hover:bg-green-600 hover:scale-101 hover:text-white transition ease-in duration-100 text-white py-2 rounded-lg disabled:opacity-50"
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
