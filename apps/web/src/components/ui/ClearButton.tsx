interface Props {
  onClick: () => void;
}

export default function ClearButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-[20%] bg-green-500 hover:bg-green-600 hover:scale-101 hover:text-white transition ease-in duration-100 text-white py-2 rounded-lg disabled:opacity-50"
    >
      Clear
    </button>
  );
}
