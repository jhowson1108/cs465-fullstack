const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/* Render the travel view from the data the API sent back */
const renderTravelList = (req, res, responseBody) => {
    let message = null;
    let trips = responseBody;

    if (!(trips instanceof Array)) {
        message = 'API lookup error';
        trips = [];
    } else if (trips.length === 0) {
        message = 'No trips exist in our database!';
    }

    res.render('travel', { title: 'Travlr Getaways', trips, message });
};

/* GET travel view, trips pulled from the API */
const travel = async (req, res, next) => {
    await fetch(tripsEndpoint, options)
        .then(response => response.json())
        .then(json => renderTravelList(req, res, json))
        .catch(err => res.status(500).send(err.message));
};

module.exports = {
    travel
};
