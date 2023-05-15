const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // passportLocalMongoose does all of the authenthication and password encryption for us

// We gained some static methods by using 'passport-local-mongoose' such as...
// authenticate(), serializeUser(), deserializeUser(), register(user, password, cb), findByUsername(), and createStrategy()
// Check the passport documentation to see what they do

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose); // Adds on a username while making sure it's unique, adds a field for password, and give us additional methods

module.exports = mongoose.model('User', UserSchema);