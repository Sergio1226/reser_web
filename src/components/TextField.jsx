export function TextField({
  value,
  placeholder,
  type = "text",
  required = false,
  children,
  name,
  onChange,
  mode = "mixed",
  readOnly = false,
  className = ""
}) {
  const handleKeyDown = (e) => {
    const key = e.key;

    if (mode === "text") {
      const allowed =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key) ||
        ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(key);
      if (!allowed) e.preventDefault();
    }

    if (mode === "numeric") {
      const allowed =
        /^[0-9]$/.test(key) ||
        ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(key);
      if (!allowed) e.preventDefault();
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    val = val.replace(/\s+/g, " ").trimStart();
    onChange({ target: { name, value: val } });
  };

  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        className={`rounded-lg p-[5px] w-full border border-black/20 ${className} ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        type={type}
        required={required}
        value={value}
        name={name}
        readOnly={readOnly}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      {children}
    </div>
  );
}

