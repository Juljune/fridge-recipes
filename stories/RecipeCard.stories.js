// A recipe card from the results grid. Same HTML as renderResults() in script.js.

// The default photo is a stand-in from stories/assets, so the story works without the internet.

export default {
  title: "Components/Recipe card",
  argTypes: {
    title: { control: "text", description: "Recipe name" },
    uses: { control: "text", description: "Fridge ingredients the recipe uses" },
    missing: {
      control: { type: "number", min: 0, max: 20, step: 1 },
      description: "How many more ingredients are needed. 0 shows “You have everything”.",
    },
    image: {
      control: "text",
      description:
        "Photo address. Paste any image URL, for example a photo from TheMealDB.",
    },
  },
  args: {
    title: "Teriyaki Chicken Casserole",
    uses: "Chicken, Rice",
    missing: 3,
    image: "images/recipe-photo.svg",
  },
  render: ({ title, uses, missing, image }) => {
    // The cards sit in the same grid as on the site.
    const grid = document.createElement("section");
    grid.className = "results";
    grid.setAttribute("aria-label", "Recipes");

    const card = document.createElement("button");
    card.type = "button";
    card.className = "recipe-card";

    const photo = document.createElement("img");
    photo.alt = "";
    photo.src = image;

    const heading = document.createElement("h2");
    heading.textContent = title;

    const usesText = document.createElement("p");
    usesText.textContent = `Uses ${uses}`;

    const needText = document.createElement("p");
    needText.textContent =
      missing === 0
        ? "You have everything"
        : `${missing} more ${missing === 1 ? "ingredient" : "ingredients"} needed`;

    card.append(photo, heading, usesText, needText);
    grid.append(card);
    return grid;
  },
};

export const Default = {};

export const HaveEverything = {
  name: "You have everything",
  args: { title: "Fluffy Omelette", uses: "Eggs", missing: 0 },
};
