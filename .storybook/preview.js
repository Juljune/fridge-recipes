// Settings shared by every story.

// Load the site's real stylesheet, so every story uses the same tokens and styles
// as the live site. Change style.css and Storybook updates too.
import "../style.css";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
  },
};

export default preview;
