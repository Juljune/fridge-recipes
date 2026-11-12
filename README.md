# Fridge Magnet Recipes

Add what's in your fridge and find recipes you can cook with it. Each recipe has a photo, an ingredient list, and step-by-step instructions.

## Files

- `index.html`: the page structure
- `style.css`: colors, type, and layout
- `script.js`: ingredient handling and recipe search

## Run it

Open `index.html` in a browser. There's nothing to install.

## Storybook

Storybook shows each piece of the site (magnets, buttons, chips, recipe card, fridge) on its own, with Controls to change the text and states. It uses the real `style.css`, so it always matches the site. The site itself doesn't need Storybook.

- Online: [juljune.github.io/fridge-recipes/storybook/](https://juljune.github.io/fridge-recipes/storybook/)
- On your computer: install [Node.js](https://nodejs.org/), then run `npm install` once and `npm run storybook`. It opens at http://localhost:6006.

The stories are in the `stories` folder. Storybook's settings are in `.storybook`.

## Credits

Recipes and photos come from [TheMealDB](https://www.themealdb.com/). This project uses its free test key for learning.
