console.log("✅ cart.js is now running at " + new Date().toISOString());

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("checkout-button");

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      subtotalEl.textContent = "0.00";
      updateCartIcon(); // ✅ Update icon when cart is empty
      return;
    }

    cart.forEach((item, index) => {
      const quantity = item.quantity ?? 1;
      const itemTotal = item.price * quantity;
      subtotal += itemTotal;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <p><strong>${item.name}</strong></p>
        <p>Qty: ${quantity}</p>
        <p>$${itemTotal.toFixed(2)}</p>
        <button class="remove-button" data-index="${index}">Remove</button>
        <hr>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    subtotalEl.textContent = subtotal.toFixed(2);
    bindRemoveButtons();
    updateCartIcon(); // ✅ Update icon after rendering
  }

  function bindRemoveButtons() {
    const buttons = document.querySelectorAll(".remove-button");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        removeItem(index);
      });
    });
  }

  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // re-render and update icon
  }

  function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const icon = document.getElementById("cart-count");
    if (icon) icon.textContent = totalCount;
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  loadCart(); // Initial render
});
