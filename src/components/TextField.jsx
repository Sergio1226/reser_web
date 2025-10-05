export function TextField({ text, placeholder, type = "text" ,required=false,children,name,onChange }) {
  return (
    <div className="relative w-full">
        <input
          placeholder={placeholder}
          className="bg-white rounded-lg p-[5px] w-full border border-black/20"
          type={type}
          required={required}
          value={text}
          name={name}
          onChange={onChange}
        />
        {children}
    </div>
  );
}
