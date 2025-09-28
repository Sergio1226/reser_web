import { Icon } from "./Icon.jsx";
export function Button({ text, onClick, style, iconName,children }) {
  return (
    <button
      className={`text-black shadow-sm rounded-button p-2 w-fit whitespace-nowrap transition transform duration-300 ease-in-out hover:scale-110 active:scale-90 active:opacity-80 flex items-center justify-center ${style}`}
      onClick={onClick}
    >
      {!children? (
        <>
          {iconName && <Icon name={iconName} />}
          {text}
        </>
      ) : (
        children
      )}
    </button>
  );
}
