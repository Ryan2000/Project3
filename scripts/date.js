/**
 * Created by ryanhoyda on 9/21/17.
 */

// makeDate script
// ===============

// This function will make a formatted date for our scraped data
var makeDate = function() {
    // Save the current date to d
    var d = new Date();
    // Prepare an empty string for our formatted state
    var formattedDate = "";
    // Take that string and concatenate the current month of d
    formattedDate += (d.getMonth() + 1) + "_";
    // Next get the number of the day in the month from d and concatenate it to the formatted date string.
    formattedDate += d.getDate() + "_";
    // Finally, then get the full year, and add that to the formatted date string
    formattedDate += d.getFullYear();
    // Return the formatted date
    return formattedDate;
};

// Export the makeDate function so other files in the backend can use it.
module.exports = makeDate;