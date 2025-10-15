// Global Cart Array to store products
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const productGrid = document.querySelector('.product-grid-section');

// -------------------- Modal/Cart Visibility Handlers --------------------

// Open the cart modal
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCart(); // Render cart contents every time it opens
});

// Close the cart modal via the 'x' button
closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close the cart modal if the user clicks anywhere outside of it
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// -------------------- Core Cart Functions --------------------

/**
 * Adds a product to the cart array or increments its quantity.
 * @param {string} name - Product name.
 * @param {number} price - Product price.
 */
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Item already exists, just increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({ name, price, quantity: 1 });
    }

    // Give user feedback
    alert(`${name} added to cart!`);

    updateCartCounts();
}

/**
 * Removes an item completely from the cart array.
 * @param {string} name - Product name to remove.
 */
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    
    // Re-render the cart display and update totals
    renderCart();
    updateCartCounts();
}

/**
 * Calculates and updates the total price and item count in the header.
 */
function updateCartCounts() {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    // Update the cart icon count
    cartCountElement.textContent = totalItems;
    
    // Update the total inside the modal
    cartTotalElement.textContent = `$${totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; // Format with commas
}

/**
 * Renders the current state of the cart array into the modal HTML.
 */
function renderCart() {
    // Clear previous items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        updateCartCounts();
        return;
    }

    // Create HTML for each item
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        // Calculate item subtotal
        const subtotal = (item.price * item.quantity).toFixed(2);

        itemElement.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
            </div>
            <div class="cart-item-subtotal">
                $${subtotal}
            </div>
            <button class="cart-item-remove" data-name="${item.name}">&times;</button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    // Add listeners to the new remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const nameToRemove = event.target.getAttribute('data-name');
            removeItem(nameToRemove);
        });
    });

    updateCartCounts();
}

// -------------------- Event Listener Setup --------------------

// Add event listener to the main product grid section for efficiency
if (productGrid) {
    productGrid.addEventListener('click', (event) => {
        // Check if the clicked element is an 'Add to Cart' button
        if (event.target.classList.contains('add-to-cart')) {
            const productCard = event.target.closest('.product-card');
            
            // Retrieve data from HTML data attributes
            const name = productCard.getAttribute('data-name');
            const price = parseFloat(productCard.getAttribute('data-price'));

            if (name && !isNaN(price)) {
                addToCart(name, price);
            }
        }
    });
}

// Initial cart count update on page load
updateCartCounts();