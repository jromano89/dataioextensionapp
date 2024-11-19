const express = require('express');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log incoming requests and responses
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response status: ${res.statusCode}`);
        originalSend.call(this, body);
    };
    next();
});

// Use the routes defined in routes.js
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
