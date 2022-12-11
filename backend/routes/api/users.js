// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');

const { setTokenCookie, reqAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters.'),
    handleValidationErrors
];

// POST /api/users
// For signing up
router.post('/', validateSignup, asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.signup({ username, email, password });

    await setTokenCookie(res, user);
    return res.json({ user });

    // If user creation is unsuccessful, then a Sequelize Validation
    // error will be passed onto the next error-handling middleware
}));

module.exports = router;