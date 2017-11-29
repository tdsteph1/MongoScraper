//Click on the [Scrape] button

$(document).on("click", "#scrapeButton", function()
{
	event.preventDefault();

	//Scrape all CBS articles prior to retrieving and displaying to client
	$.ajax({
		method: "GET",
		url: "/scrape"

	}).done(function(data)
	{
		console.log("data");
		console.log(data);

		//After Scraping articles display them on the page using another GET
		$.getJSON("/articles", function(data)
		{	
			//data: array of (Article) objects with (title) & (link)
			console.log(data);

			
			//As soon as user scrapes or hits scrapeAriticl button
			//get rid of default red <div> no articles have been scraped.
			$("#noArticles").css("display", "none");

			
			//prevents duplicates
			$("tbody").empty();
		

			//Display 20 articles
			for(var i = 0; i < 20; i++)
			{
				
				
				var tblRow = $("<tr>");
				var ul = $("<ul class='list-group'>");
				var header = $("<li class='list-group-item active header'>").html(data[i].title + "<button type='button' class='btn btn-success saveButton' data-id='" +
																				  data[i]._id + "'> Save Article </button>");
				var body = $("<li class='list-group-item body'>").html(data[i].link);
			
				//Append each article row
				tblRow.append(ul);
				tblRow.append(header);
				tblRow.append(body);


				$("tbody").append(tblRow);
				
			}

			//Display 20 articles scraped modal
			$("#myModal").modal('show');
	
	
		});
	});

});

//When user clicks on [Save Article] Button.
$(document).on("click", ".saveButton", function()
{
	//Obtain id of particular article when user clicks [Save Article]
	var thisId = $(this).attr("data-id");
	console.log(thisId);



	//Scrape all CBS articles prior to retrieving and displaying to client
	$.ajax({
		method: "POST",
		url: "/save/" + thisId

	}).done(function(data)
	{
		console.log("clicked on save button");
		console.log(data);


	});

});


/* [Article Notes] */
$(document).on("click", ".articleNotesButton", function()
{
	//Store Id of selected article into variable
	//&& display it inside the model.
	var thisId = $(this).attr("data-id");

	$("#articleId").text(thisId);

	//Make ajax call to app.get("/article/:id") in order to 
	//have previous notes remain inside modal when user returns.
	$.ajax({
		method: "GET",
		url: "/article/" + thisId
	
	}).done(function(data)
	{	
		console.log("Note/GET");
		console.log(data);

		//insert no note if currently no note exists in the modal
		$("#note").text("No Note");

		//insert button with attribute(data-id) in order to know which
		//article note we are saving which is connected to chosen article.
		$("#saveButton").append("<button data-id='" + thisId + "' type='button' class='btn btn-primary saveNoteButton'>Save Note</button>");

		//If there's a note in the article already then display it
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

	});



	//Displays Modal to save a note for a particular modal	
	$("#myModal2").modal('show');


});

//When user hits [Close] button or [X] in modal
//Because we are inserting a button with the id to identify which articles
//this prevents multiple save buttons being inserted by removing them each time
//the user closes out of modal and a new save button with article id is re-inserted.
$(document).on("click", ".exit", function()
{
	$(".saveNoteButton").css("display", "none");
});



//[Save Note] button for saveing an article note inside modal.
$(document).on("click", ".saveNoteButton", function()
{
	//grab the id of id associated with the article from the submit button
	var thisId = $(this).attr("data-id");
	console.log("saveNOte");
	console.log(thisId);




	//Run a POST request to insert a note or change the note, what's entered in the inputs
	//obrain note from textarea inside modal then insert note into DB.
	$.ajax({

		method: "POST",
		url: "/article/" + thisId,

		//value taken from textarea
		data:
		{
			//value taken from textarea inside modal
			body: $("#noteTextarea").val()
		}

	}).done(function(data)
	{

		//log the response
		console.log("save Note");
		console.log(data);

		$("#note").empty();
		$("#noteTextarea").empty();


	});

	//Empty Jumbotron container where notes are stored
	$("#note").val("");

	//empty textarea
	$("#noteTextarea").val("");
	//refresh so modal will automatically close so user can open
	//modal again in order to see newly created note inside.
	location.reload();

	//db.articles.update({ _id: ObjectId("5a1f252bdd61ab354c68f39c") }, { $set: {"note": null}} )
	//db.notes.remove({ _id: ObjectId("5a1f34425f91c436507d5324") })

});


//When user clicks on [Delete] Button at (saved.handlebars)
$(document).on("click", ".deleteButton", function()
{
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/delete/" + thisId

	}).done(function(data)
	{
		console.log("Article Deleted");

		//Refresh the page(saved.index) to see updated changes(articles deleted).
		location.reload();


	});


});

//When user clicks on red [X] img inside the modal to delete particular note
$(document).on("click", ".exitImg", function()
{
	var thisId = $(this).attr("data-id");
	console.log("exit img");
	console.log(thisId);
	
	$.ajax({
		method: "POST",
		url: "/deleteNote/" + thisId

	}).done(function(data)
	{
		console.log("Note Deleted");

		//Refresh the page(saved.index) to see updated changes(articles deleted).
		location.reload();


	});


});
