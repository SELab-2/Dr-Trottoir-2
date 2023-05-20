export default function SelectForm({
  children,
  label,
  id,
  className,
  onChange,
  value,
  required = false,
  disabled = false,
}) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className={"font-bold"}>
        {label} {required && <span className="text-bad-1">*</span>}
      </label>
      <select
        name={id}
        id={id}
        value={value}
        className={`border-2 rounded-lg  p-2 outline-none ${
          !disabled
            ? `bg-light-bg-2 border-light-h-2`
            : `border-dark-text text-light-h-3`
        }`}
        onChange={onChange}
        disabled={disabled}
      >
        <option value={""}>-- Kies een optie --</option>
        {children}
      </select>
    </div>
  );
}
