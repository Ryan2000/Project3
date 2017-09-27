/**
 * Created by ryanhoyda on 9/21/17.
 */
// Headline model
// ==============

// Require mongoose
var mongoose = require("mongoose");

// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create the headlineSchema with our schema class
var headlineSchema = new Schema({
    // headline, a string, must be entered
    title: {
        type: String,
        required: true,
        unique: true
    },

    // url, a string, must be entered
    link: {
        type: String,
        required: true
    },

    // url, a string, must be entered
    byline: {
        type: String,
        required: true
    },

    // url, a string, must be entered
    image: {
        type: String,
        required: true
    },
    // summary, a string, must be entered
    summary: {
        type: String,
        required: true
    },

    // date is just a string
    date: String,
    selected: {
        type: Boolean,
        default: false
    }
});

// Create the Headline model using the headlineSchema
var Headline = mongoose.model("Headline", headlineSchema);

// Export the Headline model
module.exports = Headline;