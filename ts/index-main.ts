import { getResult } from "./lib";

//
// DOM ELEMENTS
//

// Input and result fields
const inputField = document.getElementById("abjad-text") as HTMLInputElement;
const resultField = document.getElementById("result") as HTMLElement;
const elementsField = document.getElementById("elements-result") as HTMLElement;

// Checkboxes
// Replace your old Maghribi checkbox selector with this:
const shamsiCheckbox = document.getElementById("shamsi-check") as HTMLInputElement;
const hamzahCheckbox = document.getElementById(
  "hamzah-check",
) as HTMLInputElement;

// Buttons
const submitButton = document.getElementById(
  "submit-button",
) as HTMLButtonElement;
const resetButton = document.getElementById(
  "reset-button",
) as HTMLButtonElement;

//
// EVENT HANDLING
//

// Submit

function submitOnEnter(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    getResult(inputField, resultField, elementsField, hamzahCheckbox, shamsiCheckbox);
    e.preventDefault();
  }
}

inputField.addEventListener("keydown", submitOnEnter);

submitButton.addEventListener("click", () => {
  getResult(inputField, resultField, elementsField, hamzahCheckbox, shamsiCheckbox);
});

// Reset

resetButton.addEventListener("click", () => {
  resultField.innerHTML = "The total <em>abjad</em> value of … is …";
  elementsField.innerHTML = "<strong>Elements (Anasir):</strong> Aatishi (Fire): 0 | Baadi (Air): 0 | Aabi (Water): 0 | Khaki (Earth): 0";
});
