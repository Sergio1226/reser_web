export function Button({ text, onClick, style }) {
  return (
    <button
      className={`text-black rounded-button p-2 transition transform duration-300 ease-in-out hover:scale-110 active:scale-90 active:opacity-80 ${style}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}