interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border px-3 py-2 rounded-lg"
    />
  );
}
