const router = require('express').Router();

const { getUserId } = require('../controllers/users');

router.get('/me', getUserId);

module.exports = router;
