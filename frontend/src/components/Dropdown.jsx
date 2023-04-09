import { useState } from "react";

export default function Dropdown({ className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <div>
        <div
          onClick={() => setOpen(!open)}
          className={"relative border-2 border-bad-1 p-6 "}
        >
          <span>Click Me</span>
        </div>
        {open && (
          <div className={"border-2 border-accent-1 absolute bg-light-bg-2"}>
            <ul>
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 3</li>
            </ul>
          </div>
        )}
      </div>

      <p>
        Et accusantium qui cupiditate. Quis est enim et dolores impedit. Libero
        eum eaque sit et quia nulla repellat. Corrupti eum recusandae aut. Harum
        cupiditate iure sit voluptates delectus voluptatem placeat iusto.
        Assumenda et consequatur nemo eius.
      </p>
      <p>
        Necessitatibus sed tempore ut voluptas animi perferendis. Quis
        necessitatibus quas est. Qui ut commodi laboriosam repudiandae. Nihil
        dolorem illo sapiente amet architecto. Quia a quia facere dicta.
        Eligendi ea facilis perspiciatis praesentium delectus.
      </p>
    </div>
  );
}
