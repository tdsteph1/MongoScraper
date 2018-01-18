# MongoScraper

### Overview
In this assignment, you'll create a web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, you'll flex your Mongoose and Cheerio muscles to scrape news from another site.

### Instructions
Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

![Img1](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img1.png)
Home page of mongo scraper CBS editoin. The user must click on the red button "Scrape New Article" in order for articles to display

[Img2](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img2.png)
User clicks on Scrape button and a slew of articles appear for the user to look at.

[Img3](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img3.png)
The MongoDB updates the article collectoin by performing a post method saving all the articles into the DB.

[Img4](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img4.png)
User saves the 3rd article. NOTE: that each green save button contains the attribute data-id which contains the id of a particular article. This allows us to make distinctions between different articles in order for the right artlces to save properly.

[Img5](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img5.png)
After user clicks on green "save article" button the database updates the articles collection by inserting a new field called "saved" inside the 3rd article element which allows the field "saved" equal to true implying that this article is a saved article. Later when the user views all the saved article we use a get function to only display articles that contains the field "saved" = true, therefore allowing to efficiently obtain articles without having to create a seprate database for saved articles.

[Img6](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img6.png)
User viewing all saved articles.


[Img7](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img7.png)
The user can save a note associated with the saved article.


[Img8](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img8.png)
When the user saves a note for a particular article, we create a new field called note which stores the article id. The user can now view the note at a later time as you will see in the last image below. We use a callback function that states if note exists(not null) then display the note the user made for that article.
**code**
}).done(function(data)
	{	
		console.log("Note/GET");
		console.log(data);

		//insert no note if currently no note exists in the modal
		$("#note").text("No Note");

		//insert button with attribute(data-id) in order to know which
		//article note we are saving which is connected to chosen article.
		$("#saveButton").append("<button data-id='" + thisId + "' type='button' class='btn btn-primary saveNoteButton'>Save Note</button>");

		//If (note !NULL) OR  there's a note in the article already then display it
		if(data.note)
		{


			console.log("True insert");
			console.log(data.note);			//try data.note.body (to get just the note)


			//Append previous saved note inside modal under id=#note <span>
			//NOTE: data-id attribute stores the id of the (Note) NOT the Article. 
			//      There's Article id && Note id and use  note id to know which note
			//      we want to delete so store it in the (x) image.
			$("#note").html("<img src='images/exit.png' data-id='"+ data.note._id + "' class='img-responsive exitImg' height='10px' width='10px' alt='Responsive image'>"  + data.note.body);

		}

[Img9](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img9.png)
A new note is generated when the user clicks the save note button and updates the database. Now that the note is no longer null we can now display the note.

[Img10](https://github.com/tdsteph1/MongoScraper/blob/master/public/images/Img10.png)
User view note that was previously saved for a particular article.
