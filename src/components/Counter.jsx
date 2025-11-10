export function Counter({ count, setCount, min, max }) {
  const atMax = max !== undefined && count >= max;
  const atMin = min !== undefined && count <= min;

  return (
    <div className="flex flex-row justify-center items-center space-x-2">
      <button
        onClick={() => !atMin && setCount(count - 1)}
        className={`size-5 flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm font-bold ${
          atMin ? "bg-gray-300 cursor-not-allowed" : "bg-gray-400 hover:bg-gray-500"
        }`}
      >
        -
      </button>

      <span className="size-5 flex items-center justify-center px-4 py-2 rounded-lg bg-white border text-sm font-semibold">
        {count}
      </span>

      <button
        onClick={() => !atMax && setCount(count + 1)}
        className={`size-5 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold ${
          atMax ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-500"
        }`}
      >
        +
      </button>
    </div>
  );
}

