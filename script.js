// Where the recipes come from. "1" is TheMealDB's free test key.
const API = "https://www.themealdb.com/api/json/v1/1";

// How many recipes to show on the page.
const MAX_RESULTS = 12;

// Most kitchens have these, so they don't count as missing ingredients.
const STAPLES = ["salt", "pepper", "black pepper", "water", "oil", "olive oil", "vegetable oil"];

// The list of ingredients currently on the fridge door.
let fridge = [];

// Connect the code to the parts of the page in index.html.
const form = document.querySelector("#ingredient-form");
const input = document.querySelector("#ingredient-input");
const options = document.querySelector("#ingredient-options");
const magnets = document.querySelector("#magnets");
const suggestions = document.querySelector("#suggestions");
const findButton = document.querySelector("#find-button");
const statusText = document.querySelector("#status");
const results = document.querySelector("#results");
const dialog = document.querySelector("#recipe-dialog");
const recipeContent = document.querySelector("#recipe-content");


// ---------- Small helpers ----------

// Makes outside text safe to place inside our HTML.
function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// Makes names comparable: "Tomatoes" and "tomato" both become "tomato".
function simplify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/oes\b/g, "o")
    .replace(/s\b/g, "");
}

// Checks whether two ingredient names mean the same thing.
// Example: "chicken" matches "chicken breast".
function sameIngredient(first, second) {
  const a = ` ${simplify(first)} `;
  const b = ` ${simplify(second)} `;
  return a.includes(b) || b.includes(a);
}

function inFridge(name) {
  return fridge.some((item) => sameIngredient(item, name));
}

function isStaple(name) {
  return STAPLES.includes(name.toLowerCase());
}

// Turns TheMealDB's numbered fields (strIngredient1, strMeasure1...) into a list.
function getIngredients(meal) {
  const list = [];
  for (let number = 1; number <= 20; number++) {
    const name = (meal[`strIngredient${number}`] || "").trim();
    const measure = (meal[`strMeasure${number}`] || "").trim();
    if (name) list.push({ name, measure });
  }
  return list;
}

// Turns the recipe's block of text into separate steps.
function getSteps(instructions) {
  let steps = instructions
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^step\s*\d+$/i.test(line));

  // If the recipe is one long paragraph, split it into sentences.
  if (steps.length < 3) {
    steps = instructions.match(/[^.!?]+[.!?]+/g) || [instructions];
    steps = steps.map((step) => step.trim()).filter(Boolean);
  }
  return steps.map((step) => step.replace(/^(step\s*)?\d+[.):\s-]+/i, ""));
}


// ---------- Talking to the recipe database ----------

async function getJson(path) {
  const response = await fetch(`${API}/${path}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

async function searchByIngredient(ingredient) {
  const names = [ingredient, simplify(ingredient)];
  for (const name of names) {
    const query = encodeURIComponent(name.trim().replaceAll(" ", "_"));
    const data = await getJson(`filter.php?i=${query}`);
    if (data.meals) return data.meals;
  }
  return [];
}

async function getRecipe(id) {
  const data = await getJson(`lookup.php?i=${id}`);
  return data.meals[0];
}

// Fills the suggestions shown while typing. The site still works if this fails.
async function loadIngredientOptions() {
  try {
    const data = await getJson("list.php?i=list");
    options.innerHTML = data.meals
      .map((item) => `<option value="${escapeHtml(item.strIngredient)}"></option>`)
      .join("");
  } catch (error) {
    console.warn("Ingredient suggestions could not load.", error);
  }
}


// ---------- Fridge door ----------

function renderMagnets() {
  magnets.innerHTML = fridge
    .map((item, index) => `
      <li class="magnet">
        ${escapeHtml(item)}
        <button type="button" data-index="${index}" aria-label="Remove ${escapeHtml(item)}">×</button>
      </li>
    `)
    .join("");
}

function addIngredient(name) {
  const clean = name.trim();
  if (!clean || inFridge(clean)) return;
  fridge.push(clean);
  renderMagnets();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addIngredient(input.value);
  input.value = "";
  input.focus();
});

suggestions.addEventListener("click", (event) => {
  const ingredient = event.target.dataset.ingredient;
  if (ingredient) addIngredient(ingredient);
});

magnets.addEventListener("click", (event) => {
  const index = event.target.dataset.index;
  if (index === undefined) return;
  fridge.splice(Number(index), 1);
  renderMagnets();
});


// ---------- Finding recipes ----------

async function findRecipes() {
  // Include anything typed but not yet added.
  addIngredient(input.value);
  input.value = "";

  if (fridge.length === 0) {
    statusText.textContent = "Add at least one ingredient to find recipes.";
    results.innerHTML = "";
    return;
  }

  findButton.disabled = true;
  results.innerHTML = "";
  statusText.textContent = "Finding recipes...";

  try {
    // Search for every ingredient, then keep track of which ones each recipe uses.
    const searches = await Promise.all(fridge.map(searchByIngredient));
    const matches = new Map();

    searches.forEach((meals, index) => {
      meals.forEach((meal) => {
        if (!matches.has(meal.idMeal)) matches.set(meal.idMeal, { id: meal.idMeal, used: [] });
        matches.get(meal.idMeal).used.push(fridge[index]);
      });
    });

    // Recipes using the most fridge ingredients come first.
    const best = [...matches.values()]
      .sort((a, b) => b.used.length - a.used.length)
      .slice(0, MAX_RESULTS);

    if (best.length === 0) {
      statusText.textContent = "No recipes use these ingredients. Check the spelling or try a broader word, like “chicken” instead of “chicken thighs”.";
      return;
    }

    // Load full details so we can count what's missing.
    const recipes = await Promise.all(
      best.map(async (match) => {
        const meal = await getRecipe(match.id);
        const missing = getIngredients(meal)
          .filter((item) => !inFridge(item.name) && !isStaple(item.name));
        return { meal, used: match.used, missing };
      })
    );

    recipes.sort((a, b) => b.used.length - a.used.length || a.missing.length - b.missing.length);
    renderResults(recipes);
  } catch (error) {
    console.error(error);
    statusText.textContent = "Recipes couldn't load. Check your connection, then select Find recipes again.";
  } finally {
    findButton.disabled = false;
  }
}

function renderResults(recipes) {
  statusText.textContent = `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} for your fridge`;

  results.innerHTML = recipes
    .map(({ meal, used, missing }) => {
      const need = missing.length === 0
        ? "You have everything"
        : `${missing.length} more ${missing.length === 1 ? "ingredient" : "ingredients"} needed`;

      return `
        <button type="button" class="recipe-card" data-id="${escapeHtml(meal.idMeal)}">
          <img src="${escapeHtml(meal.strMealThumb)}/medium" alt="" loading="lazy">
          <h2>${escapeHtml(meal.strMeal)}</h2>
          <p>Uses ${escapeHtml(used.join(", "))}</p>
          <p>${need}</p>
        </button>
      `;
    })
    .join("");
}

findButton.addEventListener("click", findRecipes);


// ---------- Recipe details ----------

async function openRecipe(id) {
  try {
    const meal = await getRecipe(id);
    const ingredients = getIngredients(meal).map((item) => {
      const have = inFridge(item.name);
      return `<li class="${have ? "have" : ""}">${escapeHtml(`${item.measure} ${item.name}`.trim())}</li>`;
    });
    const steps = getSteps(meal.strInstructions).map((step) => `<li>${escapeHtml(step)}</li>`);
    const details = [meal.strArea, meal.strCategory].filter(Boolean).join(" ");
    const video = /^https:\/\//.test(meal.strYoutube || "")
      ? `<p><a href="${escapeHtml(meal.strYoutube)}" target="_blank" rel="noopener">Watch the video</a></p>`
      : "";

    recipeContent.innerHTML = `
      <button type="button" class="close-button" id="close-recipe">Close</button>
      <img class="recipe-photo" src="${escapeHtml(meal.strMealThumb)}" alt="${escapeHtml(meal.strMeal)}">
      <div class="recipe-body">
        <h2 id="recipe-title">${escapeHtml(meal.strMeal)}</h2>
        <p class="recipe-meta">${escapeHtml(details)}</p>
        <h3>Ingredients</h3>
        <ul class="ingredient-list">${ingredients.join("")}</ul>
        <h3>Instructions</h3>
        <ol class="steps">${steps.join("")}</ol>
        ${video}
      </div>
    `;
    dialog.showModal();
    dialog.scrollTop = 0;
  } catch (error) {
    console.error(error);
    statusText.textContent = "This recipe couldn't load. Select it again to retry.";
  }
}

results.addEventListener("click", (event) => {
  const card = event.target.closest(".recipe-card");
  if (card) openRecipe(card.dataset.id);
});

dialog.addEventListener("click", (event) => {
  // Close when clicking the Close button or the dark area outside the recipe.
  if (event.target.id === "close-recipe" || event.target === dialog) dialog.close();
});


// Start the page.
loadIngredientOptions();
