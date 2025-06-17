let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName) {
    const found = cart.find(item => item.name === productName);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ name: productName, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showCartNotification();
    renderOrderCartSummary();
}

function updateCartIcon() {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartIcon = document.querySelector('.bx-cart-alt');
    if (cartIcon) {
        cartIcon.setAttribute('data-count', cartCount);
        cartIcon.title = `Cart: ${cartCount} item(s)`;
    }
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    const itemsList = document.getElementById('cart-items');
    if (!modal || !itemsList) return;

    itemsList.innerHTML = '';
    if (cart.length === 0) {
        itemsList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            itemsList.innerHTML += `
                <li>
                    <img src="img/${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                    ${item.name} &times; <input type="number" value="${item.qty}" class="cart-item-quantity" data-name="${item.name}">
                    <span class="remove-item" data-name="${item.name}">&times;</span>
                </li>
            `;
        });
    }
    modal.style.display = 'flex';
}

function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showCartModal();
    renderOrderCartSummary();
}

function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    if (notification) {
        notification.style.display = 'block';
        clearTimeout(notification._timeout);
        notification._timeout = setTimeout(() => {
            notification.style.display = 'none';
        }, 1200);
    }
}

function renderOrderCartSummary() {
    const summaryDiv = document.getElementById('order-cart-summary');
    if (!summaryDiv) return;
    if (cart.length === 0) {
        summaryDiv.innerHTML = "<strong>Your cart is empty.</strong>";
    } else {
        summaryDiv.innerHTML = `
            <strong>Your Order:</strong>
            <ul>
                ${cart.map(item => `<li>${item.name} &times; ${item.qty}</li>`).join('')}
            </ul>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Attach add-to-cart button listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            if (productName) addToCart(productName);
        });
    });

    // Update cart icon initially
    updateCartIcon();

    // Cart icon click
    const cartIcon = document.querySelector('.bx-cart-alt');
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            showCartModal();
        });
    }

    // Close modal
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.onclick = hideCartModal;
    }

    // Clear cart
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.onclick = clearCart;
    }

    // Hide modal when clicking outside content
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.onclick = function (e) {
            if (e.target === this) hideCartModal();
        };
    }

    // Connect cart to order form
    const orderForm = document.querySelector('.order form');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            const cartProductsInput = document.getElementById('cartProducts');
            if (cartProductsInput) {
                cartProductsInput.value = cart.map(item => `${item.name} x${item.qty}`).join(', ');
            }
        });
    }

    // Initial render
    renderOrderCartSummary();

    // Handle quantity changes in the cart modal
    document.querySelectorAll('.cart-item-quantity').forEach(input => {
        input.addEventListener('change', function () {
            const productName = this.getAttribute('data-name');
            const found = cart.find(item => item.name === productName);
            if (found) {
                found.qty = parseInt(this.value, 10);
                if (found.qty <= 0) {
                    cart = cart.filter(item => item.name !== productName);
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartIcon();
            showCartModal();
            renderOrderCartSummary();
        });
    });

    // Handle remove item from cart
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.getAttribute('data-name');
            cart = cart.filter(item => item.name !== productName);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartIcon();
            showCartModal();
            renderOrderCartSummary();
        });
    });
});