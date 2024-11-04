document.addEventListener('DOMContentLoaded', function () {
    const cart = [];
    let totalPrice = 0;

    // Conversion rate from USD to KHR
    const conversionRate = 4100;

    // Select DOM elements
    const addToCartButtons = document.querySelectorAll('.addToCartButton');
    const cartList = document.getElementById('cartList');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutButton');
    const checkoutPopup = document.getElementById('checkoutPopup');
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutTotalPrice = document.getElementById('checkoutTotalPrice');
    const confirmCheckout = document.getElementById('confirmCheckout');
    const cancelCheckout = document.getElementById('cancelCheckout');

    // Function to update the cart display
    const updateCartDisplay = () => {
        cartList.innerHTML = ''; // Clear the cart list

        // Iterate through the cart and display each item
        cart.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = `${item.food} ($${item.price}) - Quantity: ${item.quantity}`;
            cartList.appendChild(li);
        });

        // Update total price display in both USD and KHR
        const totalPriceKHR = totalPrice * conversionRate;
        totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)} (៛${totalPriceKHR.toLocaleString()})`;
    };

    // Add item to the cart when the add to cart button is clicked
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const food = this.getAttribute('data-food');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if the item already exists in the cart
            const existingItem = cart.find(item => item.food === food);
            if (existingItem) {
                // Increase quantity if item already in the cart
                existingItem.quantity += 1;
            } else {
                // Add new item to the cart
                cart.push({ food, price, quantity: 1 });
            }

            // Update the total price
            totalPrice += price;

            // Update the cart display
            updateCartDisplay();
        });
    });

    // Show the checkout popup when the checkout button is clicked
    checkoutButton.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // Show the checkout popup
        checkoutPopup.style.display = 'block';

        // Clear the current summary and update it with the cart items
        checkoutSummary.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.food} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            checkoutSummary.appendChild(li);
        });

        // Update the total price in both USD and KHR in the checkout summary
        const checkoutTotalPriceKHR = totalPrice * conversionRate;
        checkoutTotalPrice.textContent = `$${totalPrice.toFixed(2)} (៛${checkoutTotalPriceKHR.toLocaleString()})`;
    });

    // Confirm the checkout and save the order to localStorage
    confirmCheckout.addEventListener('click', function () {
        // Save cart to localStorage
        let orders = JSON.parse(localStorage.getItem('foodOrders')) || {};
        const customerName = prompt("Enter your name:", "Sigma") || "Sigma"; // Get the customer name from input

        if (!orders[customerName]) {
            orders[customerName] = []; // Initialize array if it doesn't exist
        }

        // Store the orders correctly
        cart.forEach(item => {
            orders[customerName].push({
                food: item.food,
                price: item.price,
                quantity: item.quantity
            });
        });

        localStorage.setItem('foodOrders', JSON.stringify(orders)); // Update localStorage
        console.log(cart); // For debugging

        // Clear cart and hide checkout popup
        cart.length = 0; // Clear the cart by setting its length to 0
        totalPrice = 0;
        updateCartDisplay();
        checkoutPopup.style.display = 'none';
        alert("Order placed successfully!");
    });

    // Cancel the checkout and hide the checkout popup
    cancelCheckout.addEventListener('click', function () {
        // Hide the checkout popup
        checkoutPopup.style.display = 'none';

        // Clear the cart, summary, and total price
        cart.length = 0; // Clear the cart by setting its length to 0
        totalPrice = 0;  // Reset total price to 0
        checkoutSummary.innerHTML = ''; // Clear the checkout summary in the popup

        // Update the main cart display and total price
        updateCartDisplay();
        alert("Order canceled and cart cleared.");
    });

    // Initial display setup
    updateCartDisplay();
});
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const food = this.getAttribute('data-food');
        const price = parseFloat(this.getAttribute('data-price'));

        // Find the food image associated with this button
        const foodImage = this.closest('.foodItem').querySelector('img');
        if (foodImage) {
            // Clone the food image and animate it
            const flyingImage = foodImage.cloneNode(true);
            flyingImage.classList.add('flyingImage');
            document.body.appendChild(flyingImage);

            // Get the starting position of the image and target position of the cart
            const startPosition = foodImage.getBoundingClientRect();
            const cartPosition = cartList.getBoundingClientRect();

            // Set initial position of the cloned image
            flyingImage.style.left = `${startPosition.left}px`;
            flyingImage.style.top = `${startPosition.top}px`;

            // Trigger the animation by setting the final position
            requestAnimationFrame(() => {
                flyingImage.style.left = `${cartPosition.left}px`;
                flyingImage.style.top = `${cartPosition.top}px`;
                flyingImage.style.transform = 'scale(0.1)';
            });

            // Remove the cloned image after the animation
            flyingImage.addEventListener('transitionend', () => {
                flyingImage.remove();
            });
        }

        // Add item to cart logic
        const existingItem = cart.find(item => item.food === food);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ food, price, quantity: 1 });
        }
        totalPrice += price;
        updateCartDisplay();
    });
});
