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
  const quantity = parseInt(quantityInput.value);

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  alert`(${quantity} x ${productName} added to cart.)`;
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

// ============================
// 🔐 LOGIN & SIGNUP FEATURES
// ============================

function showLogin() {
  document.getElementById('auth-title').innerText = 'Login';
  document.getElementById('auth-name').style.display = 'none';
  document.getElementById('auth-modal').style.display = 'block';
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-password').value = '';
}

function showSignup() {
  document.getElementById('auth-title').innerText = 'Sign Up';
  document.getElementById('auth-name').style.display = 'block';
  document.getElementById('auth-modal').style.display = 'block';
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-password').value = '';
}

function hideAuth() {
  document.getElementById('auth-modal').style.display = 'none';
}

function submitAuth() {
  const mode = document.getElementById('auth-title').innerText;
  const name = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  const endpoint = mode === 'Login' ? '/login' : '/signup';
  const payload = mode === 'Login'
    ? { email, password }
    : { name, email, password };

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('auth-modal').style.display = 'none';
      document.getElementById('welcome-msg').innerText = Welcome, `${data.name || name}!`;
      document.getElementById('welcome-msg').style.display = 'inline';
      document.getElementById('logout-btn').style.display = 'inline';
    } else {
      alert(data.message || 'Error occurred');
    }
  });
}

function logout() {
  fetch('/logout', { method: 'POST' })
    .then(() => {
      document.getElementById('welcome-msg').style.display = 'none';
      document.getElementById('logout-btn').style.display = 'none';
    });
}
