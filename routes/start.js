const express = require('express');
const router = express.Router();
const startController = require('../controllers/start');

router.get('/', startController.getStarted);

module.exports = router;