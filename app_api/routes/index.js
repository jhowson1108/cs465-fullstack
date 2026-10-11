var express = require('express');
var router = express.Router();
const ctrlTrips = require('../controllers/trips');

/* GET trips list, POST a new trip. */
router
    .route('/trips')
    .get(ctrlTrips.tripsList)
    .post(ctrlTrips.tripsAddTrip);

/* GET, PUT, DELETE a single trip by code. */
router
    .route('/trips/:tripCode')
    .get(ctrlTrips.tripsFindByCode)
    .put(ctrlTrips.tripsUpdateTrip)
    .delete(ctrlTrips.tripsDeleteTrip);

module.exports = router;
