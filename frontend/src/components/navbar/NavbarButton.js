import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

/**
 * Button component of the navbar.
 * @param tag The tag that needs to be displayed on the button.
 * @param icon The icon of the button.
 * @param link The link where the button needs to send the user.
 * @constructor
 */
export default function NavbarButton({ tag, icon, link }) {
  return (
    <Link
      href={link}
      className={
        "flex items-center p-2 text-base font-normal text-dark-text rounded-lg hover:bg-accent-1 hover:text-light-h-1"
      }
    >
      <FontAwesomeIcon icon={icon} className={"flex-shrink-0 w-6 h-6 ml-4"} />
      <span className="ml-3">{tag}</span>
    </Link>
  );
}
