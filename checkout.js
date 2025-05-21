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
    
    shippingRatesContainer.innerHTML = "";
    
    rates.forEach((rate, index) => {
      const id = `rate-${index}`;
    
      const rateEl = document.createElement("div");
      rateEl.innerHTML = `
        <label>
          <input type="radio" name="shipping-rate" value="${rate.amount}" data-service="${rate.servicelevel}" id="${id}">
          ${rate.servicelevel} – $${rate.amount} (${rate.estimated_days} days)
        </label>
      `;
    
      shippingRatesContainer.appendChild(rateEl);
    });
    
    
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
    
    shippingRatesContainer.innerHTML = ""; // Clear loading message
    
    rates.forEach((rate, index) => {
      const id = `rate-${index}`;
    
      const rateEl = document.createElement("div");
      rateEl.innerHTML = `
        <label>
          <input type="radio" name="shipping-rate" value="${rate.amount}" data-service="${rate.servicelevel}" id="${id}">
          ${rate.servicelevel} – $${rate.amount} (${rate.estimated_days} days)
        </label>
      `;
    
      shippingRatesContainer.appendChild(rateEl);
    });
    
    })
    .catch(err => {
      console.error("Shipping rate error:", err);
      shippingRatesContainer.innerHTML = "<p>Error fetching shipping rates.</p>";
    });
  });
});
    
    document.getElementById("submit-order").addEventListener("click", () => {
      const selectedRate = document.querySelector('input[name="shipping-rate"]:checked');
      if (!selectedRate) {
        alert("Please select a shipping option.");
        return;
      }
    
      const shippingAmount = parseFloat(selectedRate.value);
      const serviceLevel = selectedRate.dataset.service;
    
      console.log("✅ Shipping selected:", { shippingAmount, serviceLevel });
    
      // You can extend this block in Step 3 to send email or store order
    });
    

