// backend/routes/api/index.js
const router = require('express').Router();

// Import session and users routers
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

// TEST ROUTERS

// GET /api/test
router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});

// GET /api/set-token-cookie
// Tests the setTokenCookie function
const asyncHandler = require('express-async-handler');
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', asyncHandler(async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'cupcakke'
        }
    });
    setTokenCookie(res, user);
    return res.json({ user });
}));

// GET /api/restore-user
// Tests the restoreUser middleware, checking whether or not the
// middleware has properly populated the req.user key
const { restoreUser } = require('../../utils/auth.js');
router.get('/restore-user', restoreUser, (req, res) => {
    return res.json(req.user);
});

// GET /api/require-auth
// Tests the requireAuth middleware
const { requireAuth } = require('../../utils/auth.js');
router.get('/require-auth', requireAuth, (req, res) => {
    return res.json(req.user);
});

module.exports = router;