export function Picker({ options, text, onChange }) {
  const handleChange = (e) => {
    const value = Number(e.target.value);
    onChange(value);
  };

  return (
    <select
      className="bg-gray-200 rounded-lg p-2 w-fit border border-black/20"
      onChange={handleChange}
      defaultValue=""
    >
      <option value="" disabled>
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
