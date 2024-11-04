const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Endpoint to log completed order to orders.log
app.post('/logOrder', (req, res) => {
    const { customer, items, totalPrice } = req.body;
    const orderData = `Customer: ${customer}\nItems: ${JSON.stringify(items)}\nTotal Price: $${totalPrice.toFixed(2)}\n\n`;

    fs.appendFile('orders.log', orderData, (err) => {
        if (err) {
            console.error('Failed to log order:', err);
            res.status(500).send('Error logging order');
        } else {
            console.log('Order logged successfully');
            res.send('Order logged successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
