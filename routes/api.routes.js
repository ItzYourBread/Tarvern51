const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const apiKey = require('../middlewares/apiKey.middleware');

router.post('/links', apiKey, apiController.createLink);

module.exports = router;

