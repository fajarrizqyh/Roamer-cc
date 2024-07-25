// routes.js
const express = require('express');
const router = express.Router();
const functions = require('../func/user');

router.post('/signup', functions.signup);
router.post('/login', functions.login);
router.get('/', functions.getUser);
router.get('/logout', functions.logout);

router.post('/preference', functions.preference);
router.get('/home', functions.getPreference);

module.exports = router;

