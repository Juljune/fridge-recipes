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

// Click the × to pop a magnet. The animation itself is in style.css; the sparks are
// created the same way script.js does it on the real site.
const POP_MS = 450;

function explode(list, magnet) {
  const root = getComputedStyle(document.documentElement);
  const colors = [
    getComputedStyle(magnet).backgroundColor,
    root.getPropertyValue("--brass-light"),
    root.getPropertyValue("--cream"),
    root.getPropertyValue("--berry"),
    root.getPropertyValue("--mint"),
  ];
  const x = magnet.offsetLeft + magnet.offsetWidth / 2;
  const y = magnet.offsetTop + magnet.offsetHeight / 2;

  const ring = document.createElement("span");
  ring.className = "spark spark-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  list.append(ring);

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.2;
    const distance = 70 + ((i * 37) % 60);
    const size = 6 + ((i * 5) % 9);
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.cssText = `left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px; background: ${colors[i % 2 === 0 ? 0 : (i % 4) + 1]}; --dx: ${Math.round(Math.cos(angle) * distance)}px; --dy: ${Math.round(Math.sin(angle) * distance)}px; animation-duration: ${POP_MS + (i % 4) * 60}ms;`;
    list.append(spark);
  }
  setTimeout(() => list.querySelectorAll(".spark").forEach((spark) => spark.remove()), POP_MS + 300);
}

export const PopWhenRemoved = {
  name: "Pop when removed",
  argTypes: {
    label: { table: { disable: true } },
    color: { table: { disable: true } },
    ingredients: { control: "text", description: "Ingredients, separated by commas" },
  },
  args: { ingredients: "Chicken, Eggs, Rice, Tomato, Spinach, Garlic" },
  render: ({ ingredients }) => {
    const wrapper = document.createElement("div");

    const list = document.createElement("ul");
    list.className = "magnets";
    list.setAttribute("aria-label", "Ingredients in your fridge");

    const names = ingredients.split(",").map((name) => name.trim()).filter(Boolean);
    const fill = () => {
      list.replaceChildren(...names.map(magnet));
    };
    fill();

    list.addEventListener("click", (event) => {
      if (event.target.tagName !== "BUTTON") return;
      const item = event.target.closest(".magnet");
      if (item.classList.contains("is-popping")) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return item.remove();
      item.classList.add("is-popping");
      explode(list, item);
      setTimeout(() => item.remove(), POP_MS);
    });

    const restock = document.createElement("button");
    restock.type = "button";
    restock.className = "button-secondary";
    restock.textContent = "Restock";
    restock.addEventListener("click", fill);

    wrapper.append(list, restock);
    return wrapper;
  },
};
