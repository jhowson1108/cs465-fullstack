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

module.exports = {
    tripsList,
    tripsFindByCode
};
