document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartIcon = document.getElementById("cart-icon");
    const cartCount = document.getElementById("cart-count");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Create floating notification element
    const cartNotification = document.createElement("div");
    cartNotification.id = "cart-notification";
    cartNotification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #0071e3;
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: bold;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
    `;
    document.body.appendChild(cartNotification);

    function showNotification(message) {
        cartNotification.textContent = message;
        cartNotification.style.display = "block";
        cartNotification.style.opacity = "1";
        cartNotification.style.transform = "translateY(0)";

        setTimeout(() => {
            cartNotification.style.opacity = "0";
            cartNotification.style.transform = "translateY(-10px)";
            setTimeout(() => {
                cartNotification.style.display = "none";
            }, 300);
        }, 1500);
    }

    function updateCartCount() {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;

        // Cart bounce animation
        cartIcon.classList.add("cart-bounce");
        setTimeout(() => {
            cartIcon.classList.remove("cart-bounce");
        }, 500);
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.style.display = "flex";
            cartItem.style.alignItems = "center";
            cartItem.style.justifyContent = "space-between";
            cartItem.style.padding = "12px";
            cartItem.style.borderBottom = "1px solid #e0e0e0";

            // Ensure the image URL is valid
            const imageUrl = item.image || "https://via.placeholder.com/50"; // Fallback image if none is provided
            cartItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
                    <div class="cart-item-info">
                        <p class="cart-item-name" style="margin: 0; font-weight: 600; font-size: 14px; color: #333;">${item.name}</p>
                        <p class="cart-item-price" style="margin: 0; font-size: 12px; color: #666;">$${item.price}</p>
                    </div>
                </div>
                <div class="cart-item-quantity" style="display: flex; align-items: center; gap: 6px; background: #f5f5f5; padding: 4px 10px; border-radius: 10px;">
                    <button class="decrease-quantity" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background: #ddd; border: none; font-size: 12px; cursor: pointer;">-</button>
                    <span style="font-weight: bold; font-size: 14px;">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background: #ddd; border: none; font-size: 12px; cursor: pointer;">+</button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        // Attach event listeners AFTER adding items
        document.querySelectorAll(".increase-quantity").forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = e.currentTarget.getAttribute("data-index");
                cart[idx].quantity++;
                updateCartDisplay();
            });
        });

        document.querySelectorAll(".decrease-quantity").forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = e.currentTarget.getAttribute("data-index");
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartDisplay();
            });
        });
    }

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
            const btn = e.currentTarget;
            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));
            const image = btn.getAttribute("data-image") || ""; // Ensure image URL is passed

            if (!name || isNaN(price)) return;

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ name, price, quantity: 1, image });
            }

            updateCartDisplay();
            showNotification(`${name} added to cart`);
        });
    });

    cartIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        cartSidebar.classList.add("cart-visible");
    });

    document.addEventListener("click", (event) => {
        if (!cartSidebar.contains(event.target) && event.target !== cartIcon) {
            cartSidebar.classList.remove("cart-visible");
        }
    });

    closeCartBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        cartSidebar.classList.remove("cart-visible");
    });

    checkoutBtn.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });

    updateCartDisplay();
});