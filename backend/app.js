const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const routes = require('./routes');

const isProduction = environment === 'production';

// Initializes the Express app
const app = express();

app.use(morgan('dev')); // For logging info about requests and responses
app.use(cookieParser()); // For parsing cookies
app.use(express.json()); // For parsing JSON bodies of requests with Content-Type of "application/json"

// Security Middleware
if (!isProduction) {
    // Enables cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    // Allows images with URLs to render in deployment
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Sets _csrf token (HTTP-only) and adds a req.csrfToken method on
// all requests that will be set to an XSRF-TOKEN later on
// These two cookies work together to provide CSRF protection for
// the app. The XSRF-TOKEN cookie value needs to be sent in the
// header of any request with all HTTP verbs besides GET. The header
// will be used to validate the _csrf cookie to confirm that the
// request comes from you and not an unauthorized site
app.use(
    csurf({
        // Configured to use cookies
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// Connects all the routes
app.use(routes);

// ERROR HANDLING

// Resource Not Found error-handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Sequelize errors handler
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;