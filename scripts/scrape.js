
/**
 * Created by ryanhoyda on 9/21/17.
 */
// scrape script
// =============

// Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

// This function will scrape the Jalopnik website (cb is our callback)
var scrape = function(cb) {
    // Use the request package to take in the body of the page's html
    request("http://jalopnik.com/", function(err, res, body) {
        // body is the actual HTML on the page. Load this into cheerio

        // Saving this to $ creates a virtual HTML page we can manipulate and
        // traverse with the same methods we'd use in jQuery
        var $ = cheerio.load(body);

        // Make an empty array to save our article info
        var articles = [];

        // Now, find and loop through each element that has the "theme-summary" class
        // (i.e, the section holding the articles)
        $(".post-wrapper").each(function(i, element) {
            // In each .theme-summary, we grab the child with the class story-heading

            // Then we grab the inner text of the this element and store it
            // to the head variable. This is the article headline
            var title = $(element).find("a.js_entry-link").text();

            // Grab the URL of the article
            var link = $(element).find("a.js_entry-link").attr("href");

            // Then we grab any children with the class of summary and then grab it's inner text
            // We store this to the sum variable. This is the article summary
            var summary = $(element).find(".entry-summary > p").text();

            //then we grab the image
            var image = $(element).find("source").attr("data-srcset");

            //then we grab the byline
            var byline = $(element).find("div.js_meta-byline").text();

            // So long as our headline and sum and url aren't empty or undefined, do the following
            if (title && link && summary && image && byline) {
                // This section uses regular expressions and the trim function to tidy our headlines and summaries
                // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
                //var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                //var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                // Initialize an object we will push to the articles array

                var dataToAdd = {
                    title: title,
                    link: link,
                    byline: byline,
                    image: image,
                    summary: summary
                };

                articles.push(dataToAdd);
            }
        });
        // After our loop is complete, send back the array of articles to the callback function
        cb(articles);
    });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;





