export default function TextAreaForm({
  label,
  id,
  className,
  onChange,
  value,
}) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className={"font-bold"}>
        {label}
      </label>
      <textarea
        name={id}
        id={id}
        className={
          "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
        }
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
