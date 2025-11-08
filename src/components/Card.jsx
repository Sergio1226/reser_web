import { Icon } from "./Icon.jsx";

const colorClasses = {
  green: {
    color: "bg-red-500",
    bgGradient: "from-green-600 to-green-700",
    hoverText: "group-hover:text-green-700",
    hoverBg: "group-hover:bg-green-600",
    text: "text-green-500",
  },
  blue: {
    color: "bg-blue-500",
    text: "text-blue-500",
    bgGradient: "from-blue-600 to-blue-700",
    hoverText: "group-hover:text-blue-700",
    hoverBg: "group-hover:bg-blue-600",
  },
};

export function Card({ option, onClick }) {
  const color = colorClasses[option.color] || colorClasses.green;

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 overflow-hidden transform hover:-translate-y-2 text-left w-full"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color.bgGradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
      ></div>

      <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 ${color.hoverBg} transition-colors`}>
        <Icon name={option.icon} style="mr-0" />
      </div>

      <div className="relative">
        <h3 className={`text-xl font-bold ${color.text} mb-2 ${color.hoverText} transition-colors`}>
          {option.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
      </div>

      <div className={`absolute bottom-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ${color.hoverBg} transition-colors`}>
        <svg
          className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
