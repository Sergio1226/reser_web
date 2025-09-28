
export function NavigationTab({ state,setState, options }) {
  return (
    <div
      className="w-fit p-8 bg-white rounded-xl  shadow-md flex flex-row justify-center items-center justify-between border space-x-4border-black/20"
    >
      {options.map((opt, index) => (
        <button
          key={index}
          className="size-fit p-2 flex flex-col items-center justify-center relative "
          onClick={() => {
            setState(index);
          }}
        >
          <div className="flex items-center justify-center space-x-4 flex-1">
            <img src={opt.icon} className="w-10 h-10 mb-1" alt={opt.title} />
            <span className="text-[26px] font-medium text-neutral-700">
              {opt.title}
            </span>
          </div>
          <div
            className={`w-full h-3 transition-colors ${
              state === index ? "bg-green-900" : "bg-button_bookings"
            }`}
          ></div>
        </button>
      ))}
    </div>
  );
}
