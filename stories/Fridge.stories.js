// The whole fridge from the top of the page: freezer, door, and the inside.
// Same HTML as the <header class="fridge"> in index.html.
// Use the "open" control, or click the door, to open and close it.

let count = 0;

function renderFridge({ open, badge, heading, intro, ingredients }) {
  // Each render gets its own IDs, in case two fridges are on screen at once.
  count += 1;
  const id = (name) => `${name}-${count}`;

  const magnets = ingredients
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <header class="fridge">
      <section class="freezer">
        <span class="handle" aria-hidden="true"></span>
        <p class="badge"></p>
        <h1></h1>
        <p class="intro"></p>
      </section>

      <section class="cabinet">
        <div id="${id("inside")}" class="inside">
          <button class="close-door" type="button">Close the door</button>

          <form class="add-form">
            <label for="${id("ingredient-input")}">Add an ingredient</label>
            <div class="add-row">
              <input id="${id("ingredient-input")}" autocomplete="off" placeholder="Chicken, eggs, spinach...">
              <button type="submit" class="button-secondary">Add</button>
            </div>
          </form>

          <ul class="magnets shelf" aria-label="Ingredients in your fridge"></ul>

          <div class="suggestions shelf">
            <span>Try:</span>
            <button type="button" data-ingredient="Chicken">Chicken</button>
            <button type="button" data-ingredient="Eggs">Eggs</button>
            <button type="button" data-ingredient="Rice">Rice</button>
            <button type="button" data-ingredient="Tomato">Tomato</button>
          </div>

          <button class="button-primary" type="button">Find recipes</button>
        </div>

        <button class="door" type="button" aria-controls="${id("inside")}">
          <span class="handle" aria-hidden="true"></span>
          <span class="door-label">Open the fridge</span>
        </button>
      </section>

      <div class="grille" aria-hidden="true"></div>
    </header>
  `;

  const fridge = wrapper.querySelector(".fridge");
  const inside = wrapper.querySelector(".inside");
  const door = wrapper.querySelector(".door");

  // Text from the Controls panel goes in as text, never as HTML.
  wrapper.querySelector(".badge").textContent = badge;
  wrapper.querySelector("h1").textContent = heading;
  wrapper.querySelector(".intro").textContent = intro;

  const list = wrapper.querySelector(".magnets");
  magnets.forEach((name) => {
    const item = document.createElement("li");
    item.className = "magnet";
    item.append(name);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${name}`);
    remove.textContent = "×";
    item.append(remove);
    list.append(item);
  });

  // The same open/close logic as setDoor() in script.js.
  function setDoor(isOpen) {
    fridge.classList.toggle("is-open", isOpen);
    door.setAttribute("aria-expanded", String(isOpen));
    door.setAttribute("aria-label", isOpen ? "Close the fridge" : "Open the fridge");
    inside.inert = !isOpen;
  }

  setDoor(open);
  door.addEventListener("click", () => setDoor(!fridge.classList.contains("is-open")));
  wrapper.querySelector(".close-door").addEventListener("click", () => setDoor(false));
  wrapper.querySelector("form").addEventListener("submit", (event) => event.preventDefault());

  return wrapper;
}

export default {
  title: "Components/Fridge",
  render: renderFridge,
  parameters: { layout: "fullscreen" },
  argTypes: {
    open: { control: "boolean", description: "Door open or closed. You can also click the door." },
    badge: { control: "text", description: "The script logo on the freezer" },
    heading: { control: "text", description: "The big heading" },
    intro: { control: "text", description: "The line under the heading" },
    ingredients: { control: "text", description: "Magnets inside, separated by commas" },
  },
  args: {
    open: false,
    badge: "Fridge Recipes",
    heading: "What's in your fridge?",
    intro: "Open the door, add what you have, and find recipes that use it.",
    ingredients: "Chicken, Eggs, Rice",
  },
};

export const DoorClosed = { name: "Door closed", args: { open: false } };
export const DoorOpen = { name: "Door open", args: { open: true } };
