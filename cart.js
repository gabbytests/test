document.addEventListener("DOMContentLoaded", () => {
    // Retrieve or initialize the cart array from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // DOM Elements
    const cartIcon = document.getElementById("cart-icon");
    const cartCount = document.getElementById("cart-count");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Update the cart count in the icon
    function updateCartCount() {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
    }

    // Update the cart sidebar display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <p>${item.name} - GH₵${item.price} x ${item.quantity}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
        });

        cartTotal.textContent = `Total: GH₵${total.toFixed(2)}`;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        // Attach event listeners for remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                cart.splice(idx, 1);
                updateCartDisplay();
            });
        });
    }

    // Attach click events to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
            // Use currentTarget in case the click occurred on a child element
            const btn = e.currentTarget;
            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));
            if (!name || isNaN(price)) return;

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCartDisplay();
        });
    });

    // Open cart sidebar when cart icon is clicked
    cartIcon.addEventListener("click", () => {
        cartSidebar.classList.add("cart-visible");
    });

    // Close cart sidebar when close button is clicked
    closeCartBtn.addEventListener("click", () => {
        cartSidebar.classList.remove("cart-visible");
    });

    // Checkout button event (adjust as needed)
    checkoutBtn.addEventListener("click", () => {
        alert("Proceeding to checkout...");
        window.location.href = "checkout.html";
    });

    // Initial display update
    updateCartDisplay();
});
