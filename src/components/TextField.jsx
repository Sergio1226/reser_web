export function TextField({
  value,
  placeholder,
  type = "text",
  required = false,
  children,
  name,
  onChange,
  mode = "mixed",
  className
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
    let value = e.target.value;
    value = value.replace(/\s+/g, " ").trimStart();
    onChange({ target: { name, value } });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        placeholder={placeholder}
        className="bg-white rounded-lg p-[5px] w-full border border-black/20 "
        type={type}
        required={required}
        value={value}
        name={name}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      {children}
    </div>
  );
}

