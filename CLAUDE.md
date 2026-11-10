# Fridge Recipes

A small website: you open a pink retro fridge, add the ingredients you have, and get recipes from TheMealDB.
It's a plain static site hosted on GitHub Pages. There is no build step and nothing to install.

## Files

- `index.html`: page structure (freezer, fridge door, inside of the fridge, results, recipe popup)
- `style.css`: all styles. Design tokens are at the top, in `:root`.
- `script.js`: ingredients, recipe search, recipe popup, and opening and closing the door
- `README.md`: short project description and credits

## Design direction

A glossy pastel-pink retro fridge with brass handles. Warm, playful, and tidy, like a 1950s kitchen appliance.

- One memorable thing: the fridge door that swings open. Keep everything around it calm.
- Rounded shapes: pill buttons and inputs, soft rounded cards.
- Avoid: gradients used only as decoration, identical shadowed cards, neon colors, all-caps labels, emoji in the UI.
- Never use a real appliance brand name or logo.

## Design tokens

All tokens live in `:root` at the top of `style.css`.

Color:
- `--wall` #fbf3f1: page background
- `--cream` #fffaf6: inputs, magnets, popup
- `--enamel` #f3d1d3: the fridge body
- `--enamel-light` #fce9e9: glossy highlight
- `--enamel-shade` #e3b3b8: edges, seams, borders
- `--brass` #c49a4c, `--brass-light` #ecd08f, `--brass-dark` #8a6224: handles, main button, accents
- `--ink` #4a2a2f: main text
- `--ink-soft` #7d5b60: secondary text
- `--berry` #a8394f: magnet accent

Type:
- `--badge`: Yellowtail, only for the small "Fridge Recipes" badge
- `--body`: Figtree, for everything else (400, 500, 700)

Shape: `--radius-fridge` 56px, `--radius-card` 24px, `--radius-pill` 999px
Spacing: `--space-s` 12px, `--space-m` 24px, `--space-l` 48px

## Components

| Component | CSS | HTML |
|---|---|---|
| Fridge body | `.fridge` | `index.html` |
| Freezer | `.freezer` | `index.html` |
| Door that opens | `.door`, opened with `.fridge.is-open` | `index.html`, logic in `setDoor()` in `script.js` |
| Inside of the fridge | `.inside`, `.shelf` | `index.html` |
| Brass handle | `.handle` | `index.html` |
| Ingredient magnet | `.magnet` | `renderMagnets()` in `script.js` |
| Main button | `.button-primary` | `index.html` |
| Secondary button | `.button-secondary` | `index.html` |
| Suggestion chips | `.suggestions` | `index.html` |
| Recipe card | `.recipe-card` | `renderResults()` in `script.js` |
| Recipe popup | `.recipe-dialog` | frame in `index.html`, content in `openRecipe()` in `script.js` |

## Rules for every change

1. Use tokens. Never write a raw hex color, font name, radius, or spacing value inside a component. If a new value is truly needed, add a token to `:root` first and explain why.
2. Reuse existing components before creating new ones. A new variant is a modifier class, for example `.magnet--large`.
3. Keep it plain HTML, CSS, and JavaScript. Don't add frameworks, build tools, or npm packages unless asked.
4. Keep it working on phones (375px wide) and desktops. No sideways scrolling.
5. Keep it accessible: visible keyboard focus, labels on inputs, `prefers-reduced-motion` respected, readable contrast.
6. Escape any text that comes from the recipe API with `escapeHtml()` before putting it in HTML.
7. Write UI text in plain English, sentence case, with buttons that say what they do.
8. Keep code comments short and beginner-friendly. The owner is a designer learning to code.

## Workflow

- Make changes on a new branch and open a pull request. Don't commit straight to `main`, because `main` is the live site.
- Before finishing, open the page in a browser and check the closed fridge, the open fridge, search results, and the recipe popup on desktop and phone widths.
- In the pull request, explain what changed in simple words and include screenshots.
