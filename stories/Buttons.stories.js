// The site's two button styles, using the classes from style.css.

function renderButton({ label, disabled }, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.disabled = disabled;
  return button;
}

export default {
  title: "Components/Buttons",
  argTypes: {
    label: { control: "text", description: "The button text" },
    disabled: {
      control: "boolean",
      description: "On the site, the main button is disabled while recipes load.",
    },
  },
};

// The brass "Find recipes" button.
export const Main = {
  name: "Main button",
  args: { label: "Find recipes", disabled: false },
  render: (args) => renderButton(args, "button-primary"),
};

// The outlined "Add" button next to the ingredient field.
export const Secondary = {
  name: "Secondary button",
  args: { label: "Add", disabled: false },
  render: (args) => renderButton(args, "button-secondary"),
};
