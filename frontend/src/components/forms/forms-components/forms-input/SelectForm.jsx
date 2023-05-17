export default function SelectForm({
  children,
  label,
  id,
  className,
  onChange,
  value,
  required = false,
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
        className={
          "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
        }
        onChange={onChange}
      >
        <option value={""}>-- Kies een optie --</option>
        {children}
      </select>
    </div>
  );
}