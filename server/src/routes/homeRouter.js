const express = require('express');
const router = express.Router();

const conversationsRouter = require('./conversationsRouter');
const homeController = require('../controllers/homeController');

router.use('/conversations', conversationsRouter);
router.get('/:id', homeController.getHome);

module.exports = router;