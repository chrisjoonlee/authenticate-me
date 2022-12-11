// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sets a JWT cookie after a user logs in or signs up
const setTokenCookie = (res, user) => {
    // Creates the token
    const token = jwt.sign(
        { data: user.toSafeObject() }, // Payload
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Sets the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
}

// Middleware
// Restores the session user based on the contents of the JWT cookie
const restoreUser = (req, res, next) => {
    // Parses token from user's cookies
    const { token } = req.cookies;

    // Verifies and parses the JWT's payload
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        // Searches the database for a User with the id in the payload
        try {
            const { id } = jwtPayload.data;
            // Saves the user onto the request
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            // Clears the token cookie from the response if there is an
            // error
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    })
}

// Requires a session user to be authenticated before accessing a route
const requireAuth = [
    // Ensures that if a valid JWT cookie exists, the session user
    // will be loaded onto the req.user attribute
    restoreUser,
    // Checks that there's a session user present
    function (req, _res, next) {
        if (req.user) return next();

        // Otherwise, returns an error
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = ['Unauthorized'];
        err.status = 401;
        return next(err);
    }
];

module.exports = { setTokenCookie, restoreUser, requireAuth };