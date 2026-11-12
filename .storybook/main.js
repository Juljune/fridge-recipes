// Storybook's main settings: where the stories are and which framework to use.
// "html-vite" means the stories are plain HTML (no React or Vue).
/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.js"],
  addons: [],
  // Files in stories/assets (like the stand-in recipe photo) are served at images/.
  staticDirs: [{ from: "../stories/assets", to: "/images" }],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  // Storybook will live at /storybook/ on GitHub Pages, so links must be relative.
  viteFinal: (viteConfig) => ({ ...viteConfig, base: "./" }),
};

export default config;
