const { validationResult } = require('express-validator');

// Middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    // Validates the body of requests. Use for routes that expect
    // a request body
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map(error => `${error.msg}`);

        const err = new Error('Bad request.');
        err.title = 'Bad request.';
        err.errors = errors;
        err.status = 400;
        return next(err);
    }

    next();
}

module.exports = {
    handleValidationErrors
};