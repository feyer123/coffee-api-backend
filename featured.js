function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // ✅ NEW: update the cart icon count
  updateCartIcon();

  alert(`${name} added to cart`);
}
function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const icon = document.getElementById('cart-count');
  if (icon) icon.textContent = count;
}
