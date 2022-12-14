// backend/routes/api/session.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

// Checks and validates credential and password keys from req body
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

// GET /api/session
// For getting the session user
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
        return res.json({ user: user.toSafeObject() });
    }
    else {
        return res.json({});
    }
});

// POST /api/session
// For logging in
router.post('/', validateLogin, asyncHandler(async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });

    if (!user) {
        const err = new Error('Login failed');
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        err.status = 401;
        return next(err);
    }

    await setTokenCookie(res, user);
    return res.json({ user });
}));

// DELETE /api/session
// For logging out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

module.exports = router;