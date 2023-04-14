import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Button component of the navbar.
 * @param tag The tag that needs to be displayed on the button.
 * @param icon The icon of the button.
 * @param link The link where the button needs to send the user.
 * @constructor
 */
export default function NavbarButton({ tag, icon, link }) {
  // Background is the accent colour if it is the current page.
  const router = useRouter();

  let style = "bg-dark-bg-1 hover:bg-dark-bg-2 text-dark-text";
  if (router.asPath.startsWith(link)) {
    style = "bg-accent-1 hover:bg-accent-1 text-accent-2 font-bold";
  }

  return (
    <Link
      href={link}
      className={`flex py-2 px-2 items-center rounded-lg ${style}`}
    >
      <FontAwesomeIcon icon={icon} className={"flex-shrink-0 w-4 h-4 ml-4"} />
      <span className="ml-3">{tag}</span>
    </Link>
  );
}
