const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const auth = require("../middleware/auth");

/*
 * GET
 */
router.get('/', auth, authController.home);

/*
 * POST
 */
router.post('/login', authController.login);

/*
 * POST
 */
router.post('/register', authController.register);

module.exports = router;
