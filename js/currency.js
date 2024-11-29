const currencyRates = {
    USD: 1,
    EUR: 0.95,
    ETB: 120.45,
   
};

const currencySymbols = {
    USD: '$',
    EUR: '€',
    ETB: 'Br',
   
};

function updatePrices(currency) {
    const prices = document.querySelectorAll('.price');
    
    prices.forEach(price => {
        const basePrice = parseFloat(price.dataset.usdPrice);
        const convertedPrice = basePrice * currencyRates[currency];
        
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(convertedPrice);

        const [amount, cents] = formatted.split('.');
        const currencySpan = price.querySelector('.currency');
        const amountSpan = price.querySelector('.amount');
        const centsSpan = price.querySelector('.cents');

        if (currencySpan) currencySpan.textContent = currencySymbols[currency];
        if (amountSpan) amountSpan.textContent = amount;
        if (centsSpan) centsSpan.textContent = cents;
    });

    if (window.location.pathname.includes('orders.html')) {
        updateOrderSummary();
    }
}

function saveCurrencyPreference(currency) {
    localStorage.setItem('preferredCurrency', currency);
}

function loadCurrencyPreference() {
    const savedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
    document.getElementById('currency').value = savedCurrency;
    updatePrices(savedCurrency);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCurrencyPreference();
    
    document.getElementById('currency').addEventListener('change', (e) => {
        const selectedCurrency = e.target.value;
        updatePrices(selectedCurrency);
        saveCurrencyPreference(selectedCurrency);
    });
});
