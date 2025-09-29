
export function Picker({ options, text, onChange }) {
  const handleChange = (e) => {
    const selectedIndex = e.target.key;
    if (selectedIndex >= 0) {
      onChange(selectedIndex);
    }
  };
  return (
    <select
      className="bg-gray-200 rounded-lg p-2 w-fit border border-black/20"
      onChange={handleChange}
    >
      <option value="" disabled >
        {text}
      </option>
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
