class Cart {
    constructor() {
        localStorage.removeItem('cart');
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.price').dataset.usdPrice);
                const productImage = productCard.querySelector('img').src;

                this.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            });
        });

        document.getElementById('cart-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCartStatus();
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.updateCart();
        this.showNotification('Item added to cart');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
        this.showNotification('Item removed from cart');
    }

    clearCart() {
        this.items = [];
        localStorage.removeItem('cart');
        this.updateCart();
        this.showNotification('Cart has been cleared');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.updateCart();
    }

    updateCart() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        localStorage.setItem('cart', JSON.stringify(this.items));
        
        this.updateCartCount();
        this.updateCartStatus();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = this.count;
    }

    updateCartStatus() {
        const cartStatus = document.getElementById('cart-status');
        if (this.items.length === 0) {
            cartStatus.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        let html = '<div class="cart-items">';
        this.items.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        <div class="cart-item-controls">
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button onclick="cart.removeItem('${item.id}')" class="remove-item">×</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `
            <div class="cart-total">
                <p>Total: $${this.total.toFixed(2)}</p>
                <button onclick="cart.checkout()" class="checkout-btn">Checkout</button>
                <button onclick="cart.clearCart()" class="clear-cart-btn">Clear Cart</button>
            </div>
        </div>`;
        
        cartStatus.innerHTML = html;
    }

    toggleCartStatus() {
        const cartStatus = document.getElementById('cart-status');
        cartStatus.classList.toggle('active');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    checkout() {
        alert('Checkout functionality coming soon!');
    }
}

const cart = new Cart();
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes addToCartPulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }

    @keyframes countBump {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes fadeOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(30px); opacity: 0; }
    }

    @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);