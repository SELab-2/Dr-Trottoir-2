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
export default function LinkButton({ children, icon, link, className }) {
  // Background is the accent colour if it is the current page.
  const router = useRouter();

  const path = router.asPath.replace(/\/$/g, "") + "/";

  //change style of the selected link
  let style = "";
  if (path.startsWith(link.replace(/\/$/g, "") + "/")) {
    style = "bg-accent-1 hover:bg-accent-1 text-accent-2 font-bold";
  }

  return (
    <div className={`${className} rounded-lg`}>
      <Link
        href={link}
        className={`flex py-2 px-2 items-center rounded-lg ${style} `}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={"flex-shrink-0 w-4 h-4 ml-4"}
          />
        )}
        <div className={"ml-3"}>{children}</div>
      </Link>
    </div>
  );
}
