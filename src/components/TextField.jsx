export function TextField({ text, placeholder, type = "text" ,required=false,children}) {
  return (
    <div className="relative w-full">
        <input
          placeholder={placeholder}
          className="bg-white rounded-lg p-[5px] w-full border border-black"
          type={type}
            required={required}
          value={text}
        />
        {children}
    </div>
  );
}
