const exchangeRates = {
    'USD': 1,
    'EUR': 0.95,
    'ETB': 124.72
};

const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'ETB': 'ETB'
};

document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency');
    const sortSelect = document.getElementById('sort');
    const productGrid = document.querySelector('.product-grid');

    function convertPrice(usdPrice, targetCurrency) {
        return usdPrice * exchangeRates[targetCurrency];
    }

    function updatePriceDisplay(priceElement, convertedPrice, currency) {
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(convertedPrice);

        const [amount, cents] = formatted.split('.');
        priceElement.querySelector('.currency').textContent = currencySymbols[currency];
        priceElement.querySelector('.amount').textContent = amount;
        priceElement.querySelector('.cents').textContent = cents;
    }

    function getProductPrice(productCard) {
        const priceElement = productCard.querySelector('.price');
        return parseFloat(priceElement.dataset.usdPrice);
    }

    function sortProducts(direction) {
        const products = Array.from(productGrid.children);
        const currentCurrency = currencySelect.value;

        products.sort((a, b) => {
            const priceA = getProductPrice(a);
            const priceB = getProductPrice(b);
            
            return direction === 'asc' ? priceA - priceB : priceB - priceA;
        });

        productGrid.innerHTML = '';
        products.forEach(product => {
            productGrid.appendChild(product);
        });
    }

    function updateAllPrices(selectedCurrency) {
        if (!exchangeRates[selectedCurrency]) {
            console.error('Invalid currency selected:', selectedCurrency);
            return;
        }
        
        const prices = document.querySelectorAll('.price');
        prices.forEach(price => {
            const basePrice = parseFloat(price.dataset.usdPrice);
            if (!isNaN(basePrice)) {
                updatePriceDisplay(price, basePrice * exchangeRates[selectedCurrency], selectedCurrency);
            }
        });
    }

    currencySelect.addEventListener('change', function(e) {
        const selectedCurrency = e.target.value;
        updateAllPrices(selectedCurrency);
        localStorage.setItem('preferredCurrency', selectedCurrency);
    });

    sortSelect.addEventListener('change', function(e) {
        const direction = e.target.value;
        sortProducts(direction);
        localStorage.setItem('preferredSort', direction);
    });

    const savedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
    const savedSort = localStorage.getItem('preferredSort') || 'asc';
    
    currencySelect.value = savedCurrency;
    sortSelect.value = savedSort;
    
    updateAllPrices(savedCurrency);
    sortProducts(savedSort);
});

document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value;
    if (!/^\d{16}$/.test(cardNumber)) {
        showError('Invalid card number');
        return;
    }
    
    const expiry = document.getElementById('expiry').value;
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
        showError('Invalid expiry date');
        return;
    }
});

let cartItems = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        const productCard = this.closest('.product-card');
        const product = {
            id: Date.now(),
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(productCard.querySelector('.price').dataset.usdPrice),
            quantity: 1
        };
        
        cartItems.push(product);
        updateCartCount();
        showAddToCartAnimation(this);
    });
});

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}