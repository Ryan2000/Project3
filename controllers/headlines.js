/**
 * Created by ryanhoyda on 9/21/17.
 */
// Controller for our headlines
// ============================

// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/headline");

module.exports = {
    fetch: function(cb) {

        // Run scrape function
        scrape(function(data) {
            // Here data is an array of article objects with headlines and summaries
            // Setting this to articles for clarity
            var articles = data;
            // Make sure each article object has a date and is not saved by default
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            // Headline.collection lets us access the native Mongo insertMany method.
            // We're using this instead of the mongoose create method because here we may
            // specify whether this is an ordered or unordered insert
            // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
            // unordered inserts have the benefit of being faster, and errors are logged instead
            // of thrown. This means that even if some of our inserts fail, the rest will continue
            // We expect an insert to fail whenever we have a duplicate headline since that property
            // is marked unique on the mongoose model
            Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
                cb(err, docs);
            });
        });
    },
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    get: function(query, cb) {
        // Prepare a query to get the data we scraped,
        // and sort starting from most recent (sorted by id num)
        Headline.find(query)
            .sort({
                _id: -1
            })
            // Execute this query
            .exec(function(err, doc) {
                // Once finished, pass the list into the callback function
                cb(doc);
            });
    },
    update: function(query, cb) {
        // Update the headline with the id supplied
        // set it to be equal to any new values we pass in on query
        Headline.update({ _id: query._id }, {
            $set: query
        }, {}, cb);
    },

    select: function(id, selected, cb){
        Headline.findOneAndUpdate(
            { _id: id}, { selected: selected}, cb);
    }
};