export function Picker({ options, text, onChange, value }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <select
      className="bg-gray-200 rounded-lg p-2 w-fit border border-black/20"
      onChange={handleChange}
      value={value}
    >
      <option value={0}>
        {text}
      </option>

      {options.map((opt, index) => (
        <option key={index} value={index + 1}>
          {opt}
        </option>
      ))}
    </select>
  );
}
