import LinkButton from "@/components/navbar/LinkButton";

/**
 * Create a list for the navbar.
 * @param name Name of the categories.
 * @param categories Dictionary where the keys are the different categories and the value the corresponding info.
 *            Info includes the icon and the link.
 * @param className Classes are added to the whole component.
 * @param linkClassName Classes are added to the link component in the linkList.
 * @constructor
 */
export default function LinkList({
  name,
  categories,
  className,
  linkClassName,
}) {
  let new_cat = Object.entries(categories).map(function ([category, info], i) {
    return (
      <li key={category + i}>
        <LinkButton
          icon={info.icon}
          link={info.link}
          className={`${linkClassName}`}
        >
          <p>{category}</p>
        </LinkButton>
      </li>
    );
  });

  return (
    <ul className={`space-y-2 ${className}`}>
      {name && (
        <li>
          <span className="ml-6 text-dark-h-1 font-bold">{name}</span>
        </li>
      )}
      {new_cat}
    </ul>
  );
}
