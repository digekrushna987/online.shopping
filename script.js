
const products = [
    { id: 1, name: 'Laptop', price: 999.99, image: '💻', category: 'Electronics' },
    { id: 2, name: 'Smartphone', price: 699.99, image: '📱', category: 'Electronics' },
    { id: 3, name: 'Headphones', price: 199.99, image: '🎧', category: 'Electronics' },
    { id: 4, name: 'T-Shirt', price: 29.99, image: '👕', category: 'Clothing' },
    { id: 5, name: 'Sneakers', price: 89.99, image: '👟', category: 'Clothing' },
    { id: 6, name: 'Coffee Maker', price: 149.99, image: '☕', category: 'Home' },
    { id: 7, name: 'Backpack', price: 79.99, image: '🎒', category: 'Accessories' },
    { id: 8, name: 'Watch', price: 299.99, image: '⌚', category: 'Accessories' }
];


let cart = JSON.parse(localStorage.getItem('cart')) || [];


document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializePage();
});


function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'products.html':
            displayProducts();
            break;
        case 'cart.html':
            displayCart();
            break;
        case 'order.html':
            displayOrderSummary();
            attachOrderFormHandler();
            break;
    }
  
    attachNavHandlers();
}


function attachNavHandlers() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
        });
    });
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}


function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}


function displayCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer || cart.length === 0) {
        document.querySelector('.cart-container').innerHTML = `
            <div class="empty-cart">
                <div style="font-size: 5rem; margin-bottom: 1rem;">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="products.html" class="btn mt-3">Shop Now</a>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div style="font-size: 2rem;">${item.image}</div>
            <div class="cart-item-details" style="flex: 1;">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">Total: $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="btn" style="background: #ff4757;" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    displayCartTotal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function displayCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement) {
        cartTotalElement.innerHTML = `
            <div class="total-price">Total: $${total.toFixed(2)}</div>
            <a href="order.html" class="btn">Proceed
    }
}