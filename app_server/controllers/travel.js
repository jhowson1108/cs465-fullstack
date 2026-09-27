const Trip = require('../models/travlr');

/* GET travel view, trips pulled from MongoDB */
const travel = async (req, res, next) => {
    try {
        const trips = await Trip.find({}).lean();
        res.render('travel', { title: 'Travlr Getaways', trips });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    travel
};
