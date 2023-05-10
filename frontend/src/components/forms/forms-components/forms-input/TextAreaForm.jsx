export default function TextAreaForm({
  label,
  id,
  className,
  onChange,
  value,
  required = false,
  placeholder,
}) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className={"font-bold"}>
        {label} {required && <span className="text-bad-1">*</span>}
      </label>
      <textarea
        name={id}
        id={id}
        className={
          "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
        }
        rows={5}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
