import NavbarButton from "@/components/navbar/NavbarButton";

/**
 * Create a list for the navbar.
 * @param name Name of the categories.
 * @param categories: Dictionary where the keys are the different categories and the value the corresponding info.
 * 						Info includes the icon and the link.
 * @constructor
 */
export default function NavbarList({ name, categories }) {
  let new_cat = Object.entries(categories).map(function ([category, info], i) {
    return (
      <li key={category + i}>
        <NavbarButton tag={category} icon={info.icon} link={info.link} />
      </li>
    );
  });

  return (
    <ul className="space-y-2 mt-9">
      <li>
        <span className="ml-6 text-dark-h-1 font-bold">{name}</span>
      </li>
      {new_cat}
    </ul>
  );
}
