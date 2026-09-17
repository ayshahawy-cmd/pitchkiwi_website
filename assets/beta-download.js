(function () {
  var form = document.querySelector("[data-beta-form]");
  if (!form) return;

  var email = form.querySelector("input[name='email']");
  var button = form.querySelector("button[type='submit']");
  var error = form.querySelector("[data-beta-error]");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    error.textContent = "";

    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }

    button.disabled = true;
    button.textContent = "Getting your download…";

    try {
      var response = await fetch("/api/beta-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value })
      });
      var result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }
      window.location.assign(result.redirect || "/download/");
    } catch (requestError) {
      error.textContent = requestError.message || "Something went wrong. Please try again.";
      button.disabled = false;
      button.textContent = "Download beta";
    }
  });
})();
