import { render } from "@testing-library/react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "@testing-library/jest-dom/extend-expect";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";

test("Test the nesting of cards", () => {
  const { getByText } = render(
    <PrimaryCard title="Primary card title" icon={faLocationDot}>
      <SecondaryCard title="Secondary card title" icon={faLocationDot} />
    </PrimaryCard>
  );
  const primaryCardText = getByText("Primary card title");
  const primaryCard = primaryCardText.parentElement.parentElement;
  const secondaryCardText = getByText("Secondary card title");
  const secondaryCard = secondaryCardText.parentElement.parentElement;

  // Checks if secondaryCard is a descendant of primaryCard
  expect(primaryCard).toContainElement(secondaryCard);
});
