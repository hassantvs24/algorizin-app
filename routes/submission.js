const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController.js');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mentor = require("../middleware/mentor");
/*
 * MIDDLEWARE
 */
router.use((req, res, next ) => {
let query = {};  

  if(req.query.where)
    query.where = JSON.parse(req.query.where);

  if(req.query.fields)
    query.fields = JSON.parse(req.query.fields);

  if(req.query.sort)
    query.sort = {sort : JSON.parse(req.query.sort)};
  else
    query.sort = {};

  if(req.query.limit)
    query.sort.limit = parseInt(req.query.limit);

  if(req.query.skip)
    query.sort.skip = parseInt(req.query.skip);

  req.query = query;

  next();
})

/*
 * GET
 */
router.get('/', auth, (req, res) => {
  submissionController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', auth, (req, res) => {
  submissionController.show(req, res);
});

/*
 * POST
 */
router.post('/', auth, (req, res) => {
  submissionController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', [auth, mentor], (req, res) => {
  submissionController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', [auth, admin], (req, res) => {
  submissionController.remove(req, res);
});

module.exports = router;
