export function Counter({ count, setCount ,min,max}) {
  return (
    <div className="flex flex-row justify-center items-center space-x-2">
      <button
        onClick={() => count >=(min?min:1) && setCount(count - 1)}
        className="size-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white text-sm font-bold"
      >
        -
      </button>
      <span className="size-5 flex items-center justify-center px-4 py-2 rounded-lg bg-white border text-sm font-semibold">
        {count}
      </span>
      <button
        onClick={() => count < (max?max:10e5) && setCount(count + 1)}
        className="size-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-bold"
      >
        +
      </button>
    </div>
  );
}

