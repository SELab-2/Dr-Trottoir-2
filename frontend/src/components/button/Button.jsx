import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomButton({
  children,
  onClick,
  className,
  icon,
  type,
}) {
  return (
    <button
      className={`align-middle border-2 py-2 px-3 text-center rounded-lg font-bold w-fit ${className}`}
      onClick={onClick}
      type={type}
    >
      <div className={"flex items-center justify-center"}>
        {icon && <FontAwesomeIcon icon={icon} className={"h-4"} />}
        <div className={`${icon ? "mx-4" : "mx-2"}`}>{children}</div>
      </div>
    </button>
  );
}
