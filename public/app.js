const MAX_WALLETS = 1000;

const walletInput = document.getElementById("wallet");
const humanCheck = document.getElementById("human");
const submitButton = document.getElementById("submit");
const message = document.getElementById("message");
const countDisplay = document.getElementById("count");


// =========================
// GET WALLET COUNT
// =========================

async function updateCounter() {
  try {
    const response = await fetch("/api/count");
    const data = await response.json();

    const count = Number(data.count || 0);

    countDisplay.textContent = count.toLocaleString();

    if (count >= MAX_WALLETS) {
      showWhitelistFull();
    }

  } catch (error) {
    console.log("Counter unavailable.");
  }
}


// =========================
// WHITELIST FULL
// =========================

function showWhitelistFull() {

  message.textContent =
    "WHITELIST FULL — 1,000 / 1,000 WALLETS";

  message.style.color = "#ffc400";

  submitButton.disabled = true;
  submitButton.textContent = "WHITELIST FULL";

  walletInput.disabled = true;
  humanCheck.disabled = true;
}


// =========================
// VALIDATE WALLET
// =========================

function isValidWallet(wallet) {

  return /^0x[a-fA-F0-9]{20,120}$/.test(wallet);

}


// =========================
// SUBMIT WALLET
// =========================

submitButton.addEventListener("click", async function () {

  message.textContent = "";
  message.style.color = "#ffc400";

  const wallet = walletInput.value.trim();


  // Check wallet
  if (!isValidWallet(wallet)) {

    message.textContent =
      "Please enter a valid wallet address.";

    return;
  }


  // Check human verification
  if (!humanCheck.checked) {

    message.textContent =
      "Please complete the human verification.";

    return;
  }


  // Disable button
  submitButton.disabled = true;
  submitButton.textContent = "SUBMITTING...";


  try {

    const response = await fetch(
      "/api/submit",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          wallet: wallet
        })
      }
    );


    const data = await response.json();


    // Error
    if (!response.ok) {

      throw new Error(
        data.error || "Submission failed."
      );

    }


    // Success
    message.textContent =
      "WHITELIST SUBMITTED ✓ Your wallet has been recorded.";

    message.style.color = "#20d84b";


    walletInput.value = "";
    humanCheck.checked = false;


    await updateCounter();


    // If whitelist isn't full
    if (Number(countDisplay.textContent.replace(/,/g, "")) < MAX_WALLETS) {

      submitButton.disabled = false;
      submitButton.textContent =
        "SUBMIT & JOIN THE GANG";

    }


  } catch (error) {

    message.textContent =
      error.message || "Unable to submit right now.";

    message.style.color = "#ff5555";

    submitButton.disabled = false;

    submitButton.textContent =
      "SUBMIT & JOIN THE GANG";

  }

});


// =========================
// START
// =========================

updateCounter();
