import { Icon } from "./Icon.jsx";
const colors = {
  primary:
    "bg-gradient-to-br from-button_primary to-button_primary_dark text-blue-900 shadow-button-primary hover:shadow-button-primary-hover",

  secondary:
    "bg-gradient-to-br from-button_secondary to-button_secondary_light text-green-900 shadow-button-secondary hover:shadow-button-secondary-hover",

  exit: "bg-gradient-to-br from-button_exit to-button_exit_dark text-red-900 shadow-button-exit hover:shadow-button-exit-hover",

  info:
    "bg-gradient-to-br from-button_bookings to-button_bookings_dark text-green-800 shadow-button-bookings hover:shadow-button-bookings-hover",
};
export function Button({ text, onClick, style, iconName, children, className ,type="button"}) {
  return (
    <button
      type={type}
      className={` px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 ${colors[style]} ${className}`}
      onClick={onClick}
    >
      {iconName && <Icon name={iconName} />}
      {children || text}
    </button>
  );
}
