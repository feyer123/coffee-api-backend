console.log("✅ checkout.js FINAL TEST 2 at " + new Date().toISOString());

document.addEventListener("DOMContentLoaded", () => {
  const cartSummaryContainer = document.getElementById("cart-summary");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const shippingRatesContainer = document.getElementById("shipping-rates");
  const form = document.getElementById("checkout-form");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  if (cart.length === 0) {
    cartSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item) => {
    const quantity = item.quantity ?? 1;
    const itemTotal = item.price * quantity;
    subtotal += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.innerHTML = `
      <p><strong>${item.name}</strong> × ${quantity} – $${itemTotal.toFixed(2)}</p>
    `;
    cartSummaryContainer.appendChild(itemEl);
  });

  subtotalEl.textContent = subtotal.toFixed(2);

  const zipInput = form.querySelector('input[name="zip"]');
  zipInput.addEventListener("blur", () => {
    const zipCode = zipInput.value.trim();
    if (!zipCode || zipCode.length < 5) return;

    shippingRatesContainer.innerHTML = "<p>Loading rates...</p>";

    fetch("https://dev.essentialservices.coffee/api/get-rate2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ zipCode })
    })
    .then(res => res.json())
    .then(rates => {
      if (!Array.isArray(rates)) {
        shippingRatesContainer.innerHTML = "<p>Error loading rates.</p>";
        return;
      }

      if (rates.length === 0) {
        shippingRatesContainer.innerHTML = "<p>No shipping options found.</p>";
        return;
      }

      shippingRatesContainer.innerHTML = "";
      rates.forEach(rate => {
        const rateEl = document.createElement("p");
        rateEl.textContent = `${rate.servicelevel} – $${rate.amount} (${rate.estimated_days} days)`;
        shippingRatesContainer.appendChild(rateEl);
      });
    })
    .catch(err => {
      console.error("Shipping rate error:", err);
      shippingRatesContainer.innerHTML = "<p>Error fetching shipping rates.</p>";
    });
  });
});
