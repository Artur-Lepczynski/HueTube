const colorInputs = document.querySelectorAll(".color-input");
const percentInput = document.querySelector("#gradient-percent");
const percentInputLabel = document.querySelector(".percent-label");
const stepInput = document.querySelector("#gradient-step");
const stepInputLabel = document.querySelector(".step-label");
const defaults = ["#ff0033", "#ff2791", "#ff0033", "#ffffff"];
const defaultPercent = 80;
const defaultStep = 10;

configResetButton();
configColorInputs();
configRangeInput(
  "gradientPercent",
  percentInput,
  percentInputLabel,
  defaultPercent
);
configRangeInput("gradientStep", stepInput, stepInputLabel, defaultStep);

function configColorInputs() {
  colorInputs.forEach((input, index) => {
    browser.storage.local.get(input.name).then((result) => {
      input.value = result[input.name] || defaults[index];
    });

    input.addEventListener("change", (event) => {
      const { name, value } = event.target;
      browser.storage.local.set({ [name]: value });
    });
  });
}

function configResetButton() {
  const resetButton = document.querySelector("#reset-button");

  resetButton.addEventListener("click", () => {
    colorInputs.forEach((input, index) => {
      input.value = defaults[index];
      browser.storage.local.set({ [input.name]: defaults[index] });
    });
    percentInput.value = defaultPercent;
    percentInputLabel.textContent = getPercentLabel(
      "gradientPercent",
      defaultPercent
    );
    browser.storage.local.set({ gradientPercent: defaultPercent });

    stepInput.value = defaultStep;
    stepInputLabel.textContent = getPercentLabel("gradientStep", defaultStep);
    browser.storage.local.set({ gradientStep: defaultStep });
  });
}

function configRangeInput(name, input, label, defaultValue) {
  browser.storage.local.get(name).then((result) => {
    const value = result[name] || defaultValue;
    input.value = value;
    label.textContent = getPercentLabel(name, value);
  });

  input.addEventListener("change", (event) => {
    const value = event.target.value;
    browser.storage.local.set({ [name]: value });
    input.value = value;
    label.textContent = getPercentLabel(name, value);
  });
}

function getPercentLabel(type, percent) {
  if (type === "gradientPercent") return `Gradient %(${percent}):`;
  if (type === "gradientStep") return `Step %(${percent}):`;
  return `Gradient %(${percent}):`;
}

// function add(item) {
//   document.body.append(item);
// }
