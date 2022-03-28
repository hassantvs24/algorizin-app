const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
 * GET
 */
router.get('/', [auth, admin], userController.list);

/*
 * GET
 */
router.get('/:id', [auth, admin], userController.show);

/*
 * POST
 */
router.post('/', [auth, admin], userController.create);

/*
 * PUT
 */
router.put('/:id', [auth, admin], userController.update);

/*
 * DELETE
 */
router.delete('/:id', [auth, admin], userController.remove);

module.exports = router;
