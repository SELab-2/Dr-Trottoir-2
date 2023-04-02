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
  const router = useRouter();
  console.log(router.asPath);
  console.log(link);

  let background = "bg-dark-bg-1";
  let hover_background = "bg-dark-bg-2";
  let text = "text-dark-text";
  if (router.asPath.startsWith(link)) {
    background = "bg-accent-1";
    hover_background = background;

    text = "text-dark-bg-2";
  }

  return (
    <Link
      href={link}
      className={`flex items-center p-2 text-base font-normal ${text} rounded-lg ${background} hover:${hover_background}`}
    >
      <FontAwesomeIcon icon={icon} className={"flex-shrink-0 w-6 h-6 ml-4"} />
      <span className="ml-3">{tag}</span>
    </Link>
  );
}
