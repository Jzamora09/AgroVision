interface Props {
  text: string;
}

export default function AuthButton({
  text,
}: Props) {
  return (
    <button
      className="
      w-full
      rounded-xl
      bg-green-600
      py-3
      font-semibold
      text-white
      transition
      hover:bg-green-700
      "
    >
      {text}
    </button>
  );
}