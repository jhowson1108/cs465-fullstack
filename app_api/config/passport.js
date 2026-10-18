const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (username, password, done) => {
        try {
            const q = await User.findOne({ email: username }).exec();

            if (!q) { // If the DB returned no records, the user doesn't exist
                return done(null, false, { message: 'Incorrect username' });
            }
            if (!q.validPassword(password)) { // Validate password
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, q); // Everything is OK, return user object
        } catch (err) {
            return done(err);
        }
    }
));
