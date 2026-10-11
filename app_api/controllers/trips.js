const Trip = require('../models/travlr');

/* GET all trips. */
const tripsList = async (req, res) => {
    try {
        const q = await Trip.find({}).exec();
        if (q.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/* GET a single trip by its code. */
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Trip.find({ code: req.params.tripCode }).exec();
        if (q.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/* POST a new trip. */
const tripsAddTrip = async (req, res) => {
    try {
        const q = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        return res.status(201).json(q);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

/* PUT an update to an existing trip. */
const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();
        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(q);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

/* DELETE a trip by its code. */
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json({ message: 'Trip ' + req.params.tripCode + ' deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
