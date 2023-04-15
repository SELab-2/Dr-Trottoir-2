import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomCard({ children, title, className, icon }) {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      {(title || icon) && (
        <div className={"flex items-center font-bold text-light-h-2 mb-4"}>
          {icon && <FontAwesomeIcon icon={icon} className={"h-4 ml-1 mr-2"} />}
          {title && <p>{title}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
