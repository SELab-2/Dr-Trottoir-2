export default function InputForm({
  label,
  id,
  className,
  onChange,
  value,
  type,
  required = false,
  disabled = false,
  placeholder,
}) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className={"font-bold after:required:"}>
        {label} {required && <span className="text-bad-1">*</span>}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        className={`border-2 rounded-lg  p-2 outline-none ${
          !disabled
            ? `bg-light-bg-2 border-light-h-2`
            : `border-dark-text text-light-text`
        }`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
