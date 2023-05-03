export default function SelectForm({
  children,
  label,
  id,
  className,
  onChange,
}) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className={"font-bold"}>
        {label}
      </label>
      <select
        name={id}
        id={id}
        className={
          "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
        }
        onChange={onChange}
      >
        {children}
      </select>
    </div>
  );
}
