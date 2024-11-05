const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to log completed orders
app.post('/logOrder', (req, res) => {
    const completedOrder = req.body;

    // Simulate saving the order to a database or logging it
    console.log('Order received:', completedOrder);

    // Send a response back to confirm receipt
    res.send('Order logged successfully.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
