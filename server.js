//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//Our scraping tools
//(request) makes HTTP request for html page && 
//(cheerio) parse our html and helps us find elements
var request = require("request");
var cheerio = require("cheerio");

//require all models
var db = require("./models");

//initialize express
var app = express();
var PORT = 3000;

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//use morgan logger for loggging requests
app.use(logger("dev"));

//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set up mongoose & connect to mongoDB
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/MongooseScraper",
{
	useMongoClient: true
});

//Send User to (index.handlebars)
app.get("/", function(req, res) 
{
 db.Article.find({}).then(function(dbArticle)
 {

    //If we were able to successfully find articles,
    //then display (index.handlebars) with all articles found at
    //http://www.cbsnews.com.
    res.render("index", dbArticle);
 

  });

 

});

//POST: will save an article using boolean(0 or 1) by finding article (id)
//Executes when click on particular article button [Save Article]
app.post("/save/:id", function(req, res)
{
	//Find A particular article by the id we passin as argument then add field called (saved)
	//then insert boolean value true(1) to imply saved article.
	db.Article.update({ _id: req.params.id }, {$set: {"saved": 1}}).then(function(dbArticle)
	{
		console.log(dbArticle);

		res.json(dbArticle);

	}).catch(function(err)
	{
		res.json(err);
	});

});

//GET: add populate the field(note) of selected article
app.get("/article/:id", function(req, res)
{
	

	//Finish the route so it finds the route so it finds one article using the (req.params.id),
	//and run the populate methoed with (noote), then responds with the article with the (note) included
	db.Article.findOne({ _id: req.params.id}).populate("note").then(function(dbArticle)
	{
		

		res.json(dbArticle);

	}).catch(function(err)
	{
		//Error
		res.json(err);
	});


  

	
});

//POST: create a new note by inserting it in the field which comes from
//      the user typing note in modal/textarea and pressing [Save Note] button
app.post("/article/:id", function(req, res)
{
	//Create a new note & pass the req.body to the entry
	db.Note.create(req.body).then(function(dbNote)
	{
		//If a note was created successfully, find one article with an "_id"
    	//equal to "req.params.id" update the article to be associated with the new
    	//Note. {new: true} tells the query that we want it to return the updated User
    	//-- it returns the original by default since our mongoose query returns a promise,
    	//we can chain another '.then' which receives the result of the query
    	return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true} );

	}).then(function(dbArticle)
	{
		//If we were able to successfully update an Article, send it back to client
		res.json(dbArticle);

	}).catch(function(err)
	{
		//Error
		res.json(err);
	});

});

//POST will delete an article when user clicks on [Delete]
//     by changing saved value from true(1) to false(0)
app.post("/delete/:id", function(req, res)
{
	//Find A particular article by the id we passin as argument then
	//insert boolean value true(1) to imply saved article.
	db.Article.update({ _id: req.params.id }, {$set: {"saved": 0}}).then(function(dbArticle)
	{
		console.log(dbArticle);

		res.json(dbArticle);

	}).catch(function(err)
	{
		res.json(err);
	});

});

//Deletes a note inside the modal
app.post("/deleteNote/:id", function(req, res)
{
	console.log("Delete")
	console.log(req.params.id);

	db.Note.remove({ _id: req.params.id }).then(function(dbNote)
	{
		res.json(dbNote);

	}).catch(function(err)
	{
		res.json(err);
	})
});



//Send User to (saved.handlebars).
//Executes when click on link in navbar (Saved Articles)
//NOTE!!! Because we are clicing onto another page we use handle bars so that
//        updates automatically work meaning remove red <div> No articles default message
//        when we have saved articles. {{#each savedArticles}} allows us to immediately reflect
//        those updates becasue without handlebars({{}}) we would have to hit (Saved Articles)
//		  link twice in order for updates to properly work. 
app.get("/saved", function(req, res)
{
 db.Article.find({"saved": true}).then(function(dbArticle)
 {
 	console.log(dbArticle);

 	var articles =
 	{
 		savedArticles: dbArticle
 	}
    //If we were able to successfully find articles,
    //then display (index.handlebars) with all articles found at
    //http://www.cbsnews.com.
    res.render("saved", articles);
 

  });
});

//Scrape All Article at (www.cbsnews.com)
app.get("/scrape", function(req, res)
{
	//First we grab the body of the HTML request
	request("http://www.cbsnews.com/", function(error, response, html) 
	{
		//Then we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);

		//Now, we grab every h2 within an article tag
		$("h3").each(function(i, element)
		{
			//save an empty result object
			var result = {};

			result.title = $(this).text();
			result.link = "https://www.cbsnews.com/" + $(this).parent("a").attr("href");


			//Create a new Article using the (result) object built.
			//This creates (articles) collection AND stores (result.title) & (result.link)
			//in the articles collection/table
			db.Article.create(result).then(function(dbArticle)
			{

				//If we were able to successfully scrape & save an article
				res.json(dbArticle);

			}).catch(function(err)
			{
				//ERROR
				res.json(err);
			});
			
		});
	});
});

//Obtain all scraped articles
app.get("/articles", function(req, res)
{

	db.Article.find({}).then(function(dbArticle)
	{
		//If successful finding articles send back to client
		res.json(dbArticle);

	}).catch(function(err)
	{
		//Error
		res.json(err);
	});

});


// Start the server
app.listen(PORT, function() 
{
  console.log("App running on port " + PORT + "!");
});