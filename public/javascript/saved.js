/**
 * Created by ryanhoyda on 9/21/17.
 */
/* global bootbox */
$(document).ready(function() {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var articleContainer = $(".article-container");
    // Adding event listeners for dynamically generated buttons for deleting articles,
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.remove", handleArticleDelete);
    $(document).on('change', '.select-box', handleArticleSelection);
    handleArticleScrape();



    // initPage kicks everything off when the page is loaded
   // initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines").then(function(data) {
            // If we have headlines, render them to the page
            if (data && data.length) {
                renderArticles(data);
            }
        });
    }

    function renderArticles(articles) {
        // This function handles appending HTML containing our article data to the page
        // We are passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all of the HTML for the articles stored in our articlePanels array,
        // append them to the articlePanels container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        // This functiont takes in a single JSON object for an article/headline
        // It constructs a jQuery element containing all of the formatted HTML for the
        // article panel
        var panel = $(
            [
                "<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                "<a class='article-link' target='_blank' href='" + article.link + "'>",
                article.title,
                "</a>",
                "<a class='btn btn-danger remove'>",
                "Remove Article",
                "</a>",
                "<label class='select-label'>Selected</label>",
                "<input class='select-box' type='checkbox'" + ((article.selected) ?  "checked" : '') + "/>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "<div>",
                article.byline,
                "</div>",
                "<div>",
                "<img src='", article.image,"'></img>",
                "</div>",
                "</div>",
                "</div>"
            ].join("")
        );
        // We attach the article's id to the jQuery element
        // We will use this when trying to figure out which article the user wants to remove or open notes for
        panel.data("_id", article._id);
        // We return the constructed panel jQuery element
        return panel;
    }

    // function renderEmpty() {
    //     // This function renders some HTML to the page explaining we don't have any articles to view
    //     // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    //     var emptyAlert = $(
    //         [
    //             "<div class='alert alert-warning text-center'>",
    //             "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
    //             "</div>",
    //             "<div class='panel panel-default'>",
    //             "<div class='panel-heading text-center'>",
    //             "<h3>Would You Like to Browse Available Articles?</h3>",
    //             "</div>",
    //             "<div class='panel-body text-center'>",
    //             "<h4><a href='/'>Browse Articles</a></h4>",
    //             "</div>",
    //             "</div>"
    //         ].join("")
    //     );
    //     // Appending this data to the page
    //     articleContainer.append(emptyAlert);
    // }

    function handleArticleDelete() {
        // This function handles deleting articles/headlines
        // We grab the id of the article to delete from the panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        // Using a delete method here just to be semantic since we are deleting an article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            // If this works out, run initPage again which will rerender our list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        // This function handles the user clicking any "scrape new article" buttons
        $.get("/api/fetch").then(function(data) {
            // If we are able to succesfully scrape the NYTIMES and compare the articles to those
            // already in our collection, re render the articles on the page
            // and let the user know how many unique articles we were able to save
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
        });
    }

    function handleArticleSelection(){
        var article = $(this).parents('.panel').data();
        var selected = $(this).is(':checked');
        var url = '/api/headlines/' + article._id;

        $.post(url, { selected: selected});



    }

});