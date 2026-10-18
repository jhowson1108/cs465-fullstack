const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const ctrlTrips = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.status(401).json({ message: 'Auth Header Required' });
    }

    const headers = authHeader.split(' ');
    if (headers.length < 2 || headers[0] !== 'Bearer' || !headers[1]) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.status(401).json({ message: 'Bearer Token Required' });
    }

    const token = headers[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({ message: 'Token Validation Error' });
        }
        req.auth = verified; // Set the auth param to the decoded object
        next(); // Only continue once the token is verified
    });
}

/* Authentication routes. */
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

/* GET trips list, POST a new trip. */
router
    .route('/trips')
    .get(ctrlTrips.tripsList)
    .post(authenticateJWT, ctrlTrips.tripsAddTrip);

/* GET, PUT, DELETE a single trip by code. */
router
    .route('/trips/:tripCode')
    .get(ctrlTrips.tripsFindByCode)
    .put(authenticateJWT, ctrlTrips.tripsUpdateTrip)
    .delete(authenticateJWT, ctrlTrips.tripsDeleteTrip);

module.exports = router;
