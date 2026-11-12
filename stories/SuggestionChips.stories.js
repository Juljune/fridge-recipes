// The "Try:" suggestion chips. Selecting one adds that ingredient on the site.

export default {
  title: "Components/Suggestion chips",
  argTypes: {
    label: { control: "text", description: "The text in front of the chips" },
    ingredients: { control: "text", description: "Ingredients, separated by commas" },
  },
  args: { label: "Try:", ingredients: "Chicken, Eggs, Rice, Tomato" },
  render: ({ label, ingredients }) => {
    const chips = document.createElement("div");
    chips.className = "suggestions";

    if (label) {
      const intro = document.createElement("span");
      intro.textContent = label;
      chips.append(intro);
    }

    ingredients
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.dataset.ingredient = name;
        chip.textContent = name;
        chips.append(chip);
      });

    return chips;
  },
};

export const Default = {};
