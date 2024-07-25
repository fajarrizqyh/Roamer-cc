const express = require('express');
const router = express.Router();
const functions = require('../func/places');

router.post('/create', functions.upload);
router.post('/filter', functions.filterPlace);
router.post('/likeplace', functions.likeplace);
router.get('/getlikeplace', functions.getlikeplace);
router.get('/:id', functions.getPlace);
router.get('/', functions.getallPlaces);

module.exports = router;