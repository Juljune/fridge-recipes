// The ingredient magnet: one ingredient stuck on the fridge.
//
// In style.css the magnet's color depends on its position in the list:
// 1st cream, 2nd berry, 3rd brass, 4th mint, then it repeats (the :nth-child rules).
// To show one color on its own, this story adds invisible magnets in front
// of the real one. That way style.css stays exactly as it is.

const COLORS = { Cream: 0, Berry: 1, Brass: 2, Mint: 3 };

function magnet(label) {
  const item = document.createElement("li");
  item.className = "magnet";
  item.append(label);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.setAttribute("aria-label", `Remove ${label}`);
  remove.textContent = "×";
  item.append(remove);
  return item;
}

function renderMagnet({ label, color }) {
  const list = document.createElement("ul");
  list.className = "magnets";
  list.setAttribute("aria-label", "Ingredients in your fridge");

  // Invisible placeholders that push the magnet into the right color slot.
  for (let i = 0; i < COLORS[color]; i++) {
    const spacer = document.createElement("li");
    spacer.hidden = true;
    list.append(spacer);
  }

  list.append(magnet(label));
  return list;
}

export default {
  title: "Components/Ingredient magnet",
  render: renderMagnet,
  argTypes: {
    label: { control: "text", description: "The ingredient name" },
    color: {
      control: "inline-radio",
      options: Object.keys(COLORS),
      description: "Cream, berry, brass, or mint. On the site this follows the magnet's position.",
    },
  },
  args: { label: "Chicken", color: "Cream" },
};

export const Cream = { args: { label: "Chicken", color: "Cream" } };
export const Berry = { args: { label: "Eggs", color: "Berry" } };
export const Brass = { args: { label: "Rice", color: "Brass" } };
export const Mint = { args: { label: "Tomato", color: "Mint" } };

// Several magnets in a row, like on the site. Type ingredients separated by commas.
export const AllColors = {
  name: "All colors together",
  argTypes: {
    label: { table: { disable: true } },
    color: { table: { disable: true } },
    ingredients: { control: "text", description: "Ingredients, separated by commas" },
  },
  args: { ingredients: "Chicken, Eggs, Rice, Tomato, Spinach, Garlic" },
  render: ({ ingredients }) => {
    const list = document.createElement("ul");
    list.className = "magnets";
    list.setAttribute("aria-label", "Ingredients in your fridge");
    ingredients
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => list.append(magnet(name)));
    return list;
  },
};
