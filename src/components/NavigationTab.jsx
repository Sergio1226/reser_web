export function NavigationTab({ state, setState, options }) {
  return (
    <div className="w-fit p-8 bg-white  rounded-xl shadow-md flex flex-col md:flex-row items-center space-x-6 border border-black/20 ">
      {options.map((opt, index) => (
        <button
          key={opt.id}
          className="size-fit p-2 flex flex-col items-center justify-center relative group"
          onClick={() => setState(index)}
        >
          <div className="flex items-center justify-center space-x-4 px-2">
            <img src={opt.icon} className="w-10 h-10" alt={opt.title} />
            <span className="text-[20px] font-medium text-neutral-700">
              {opt.title}
            </span>
          </div>

          <div
            className={`
              w-full h-[15px] mt-2 transition-colors rounded 
              ${state === index ? "bg-green-900" : "bg-button_bookings group-hover:bg-green-600"}
            `}
          />
        </button>
      ))}
    </div>
  );
}
