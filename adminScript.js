document.addEventListener('DOMContentLoaded', function () {
    const orderList = document.getElementById('orderList');
    const customerOrderList = document.getElementById('customerOrderList');
    const clearOrdersButton = document.getElementById('clearOrdersButton');
    const password = 'bigblacknigga';

    // Conversion rate from USD to KHR
    const conversionRate = 4100;

    // Function to update the order display
    const updateOrderDisplay = () => {
        const orders = JSON.parse(localStorage.getItem('foodOrders')) || {}; // Fetch orders

        orderList.innerHTML = ''; // Clear existing orders
        customerOrderList.innerHTML = ''; // Clear existing customer orders

        // Display orders by customer
        Object.keys(orders).forEach(customer => {
            if (Array.isArray(orders[customer])) {
                const customerLi = document.createElement('li');
                let totalOrderCostUSD = 0;

                // Prepare the order details and calculate total in USD
                const orderDetails = orders[customer].map(order => {
                    const orderCostUSD = order.price * order.quantity;
                    totalOrderCostUSD += orderCostUSD;
                    return `${order.food} x ${order.quantity} ($${orderCostUSD.toFixed(2)})`;
                }).join(', ');

                // Convert the total to KHR
                const totalOrderCostKHR = totalOrderCostUSD * conversionRate;

                // Display total cost in USD and KHR for the customer
                customerLi.textContent = `Orders for ${customer}: ${orderDetails} - Total: $${totalOrderCostUSD.toFixed(2)} (៛${totalOrderCostKHR.toLocaleString()})`;

                // Check if all items are marked as done
                const allDone = orders[customer].every(order => order.completed);

                if (!allDone) {
                    // "Mark as Done" button for orders not yet completed
                    const markAsDoneButton = document.createElement('button');
                    markAsDoneButton.textContent = 'Mark as Done';
                    markAsDoneButton.addEventListener('click', function () {
                        markOrderAsDone(customer, orders[customer], totalOrderCostUSD, totalOrderCostKHR); // Mark order as done
                        orders[customer].forEach(order => order.completed = true); // Set completed flag for each item
                        localStorage.setItem('foodOrders', JSON.stringify(orders)); // Update localStorage
                        updateOrderDisplay(); // Refresh display
                    });
                    customerLi.appendChild(markAsDoneButton); // Append the button to the customer order item
                } else {
                    // If marked as done, visually indicate it
                    customerLi.style.textDecoration = 'line-through'; // Strike-through for done orders
                    customerLi.style.color = 'gray'; // Dim text color
                }

                customerOrderList.appendChild(customerLi); // Append to customer order list
            }
        });
    };

    // Function to log completed order to the server
    const markOrderAsDone = (customer, items, totalPriceUSD, totalPriceKHR) => {
        const completedOrder = {
            customer,
            items,
            totalPriceUSD,
            totalPriceKHR
        };

        // Send completed order to server for logging
        fetch('http://localhost:3000/logOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completedOrder)
        })
        .then(response => response.text())
        .then(responseMessage => {
            console.log(responseMessage);
            alert(`Order for ${customer} marked as done and logged.`);
        })
        .catch(error => {
            console.error("Error logging completed order:", error);
        });
    };

    // Function to delete all orders for a specific customer
    const deleteCustomerOrders = (customer) => {
        let orders = JSON.parse(localStorage.getItem('foodOrders')) || {};
        if (orders[customer]) {
            delete orders[customer];
            localStorage.setItem('foodOrders', JSON.stringify(orders));
            updateOrderDisplay();
            alert(`All orders for ${customer} have been deleted.`);
        }
    };

    // Initial load - display all orders
    updateOrderDisplay();

    // Listen for changes to localStorage
    window.addEventListener('storage', function (event) {
        if (event.key === 'foodOrders') {
            updateOrderDisplay();
        }
    });

    // Clear all orders (requires password)
    clearOrdersButton.addEventListener('click', function () {
        const security_code = prompt("Please enter the password to clear all orders");
        if (security_code === password) {
            localStorage.removeItem('foodOrders');
            updateOrderDisplay();
            alert("All orders have been cleared!");
        } else {
            alert("Wrong Password");
        }
    });
});
