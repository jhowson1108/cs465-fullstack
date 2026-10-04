var express = require('express');
var router = express.Router();
const ctrlTrips = require('../controllers/trips');

/* GET trips list. */
router.route('/trips').get(ctrlTrips.tripsList);

/* GET trip by code. */
router.route('/trips/:tripCode').get(ctrlTrips.tripsFindByCode);

module.exports = router;
