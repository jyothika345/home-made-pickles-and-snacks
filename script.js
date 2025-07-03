let cart = [];

function increaseQuantity(button) {
  const input = button.parentElement.querySelector('input');
  input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(button) {
  const input = button.parentElement.querySelector('input');
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

function addToCart(button, productName, price) {
  const quantityContainer = button.previousElementSibling;
  const quantityInput = quantityContainer.querySelector('input');
  const quantity = parseInt(quantityInput.value);  // ✅ Line 15

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += quantity;
  } 
  else {
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  alert(`${quantity} x ${productName} added to cart.`);  // ✅ Line 22

  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  let total = 0;

  cartItems.forEach(item => {
    const li = document.createElement('li');
    const itemTotal = item.price * item.quantity;
    li.textContent = `${item.name} - ₹${item.price} × ${item.quantity} = ₹${itemTotal}`;
    cartList.appendChild(li);
    total += itemTotal;
  });

  totalEl.textContent = `Total Amount: ₹${total}`;
}

function clearCart() {
  localStorage.removeItem('cart');
}