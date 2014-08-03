
var played = false;

var continue_playing = true;

var my_media = null;
var duration = 0;


function info(){
	if (window.location.hash == "#welcome"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/welcome.wav")
	}
	if(window.location.hash == "#gallery"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/gallery.wav")
	}
	if(window.location.hash == "#Painting"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/piece.wav")
	}
}


function info(){
	if (window.location.hash == "#welcome"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/welcome.wav")
	}
	if(window.location.hash == "#gallery"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/gallery.wav")
	}
	if(window.location.hash == "#Painting"){
		play_audio(false, "https://s3.amazonaws.com/RamaAudio/piece.wav")
	}
}


function play_audio(ifPlayed, url)
{
	var url_array = url.split(",");	

	if (continue_playing == false)
		return;
	
	if (my_media != null)
		my_media.stop();
		
	my_media = new Media(url_array[0],
        // success callback
        function() {
            //alert("playAudio():Audio Success");
        },
        // error callback
        function(err) {
            //alert("playAudio():Audio Error: "+err);
	});
	my_media.play();
	played = ifPlayed;

    var getDur = setTimeout(function() {

		var duration = my_media.getDuration();	
		if (duration <= 0) //error so exit
			return;
			
		// Play audio


	    var timerDur = setTimeout(function() {				
			if (url_array.length==1)
				return;
			
			my_media.stop();

			my_media = new Media("https://s3.amazonaws.com/RamaAudio/hearmore.wav",
				// success callback
				function() {
				// alert("playAudio():Audio Success");
				},
				// error callback
				function(err) {
				// alert("playAudio():Audio Error: "+err);
			});
						
			my_media.play(); //would you like to hear more?
			
			var otherTimer = setTimeout(function () { //wait 1.5 secs and then record 
					sp.recognize();
			}, 2500);
			
			var newTimeDur = setTimeout(function () {
				if (continue_playing == true)
				{
					url_array.shift();
					play_audio(ifPlayed, url_array.toString());
				}
			}, 2500);  //give user a few seconds to respond
			
		}, (1000*duration)-1000);
  
    }, 2750);	
}




function pause_audio(){
	my_media.pause();
}
function resume_audio(){
	my_media.play();
}

function hideDivs(){
	var string = "_categories";
	var array = ["original", "artist", "piece"];
	array.forEach(function(category){
		document.getElementById(category+string).style.display = "none";
	});
}

function showDiv(div_to_show)
{
	document.getElementById(div_to_show+"_categories").style.display = "block";
}

function piece() {
	this.piece_basics = {title:"", year:"", artist:"", dimensions:"", image:""};
    this.categories = ["about the artist", "about the piece"];
    this.artist_details = {audio_on_load:"", biography:"", career:""};
    this.piece_details = {audio_on_load:"", medium:"", style:""}; 
}

var current_piece = new piece();



var handler = {


setContinuePlaying:  function(boolvalue)
{
	continue_playing = boolvalue;
	if (continue_playing == false) {
		if (my_media != null)
		{
			my_media.pause();
		}
	}
}, 

load: function(result)
{
			continue_playing = true;
            var pieces = [];
            serverURL = "http://leiner.cs-i.brandeis.edu:9000";
            //load database pieces into variable pieces
    		$.ajax({
        		type: "GET",
        		url: serverURL + "/pieces",
    		}).done(function(db_pieces) {
					alert(JSON.stringify(db_pieces));
    				//each item is a piece
    				db_pieces.forEach(function(item) {
    					pieces[pieces.length] = item;
    				});
				if (document.getElementById("paintings_categories").style.display != "none")
				{
					pieces.forEach(function(piece) {
						var name = piece.piece_basics.title.toLowerCase();
						if (result.search(name) > -1)
						{
							new_name = name.replace(" ", "");
							document.getElementById("current_painting").src = piece.picture;
							document.getElementById("current_title").innerHTML = toTitleCase(name);
							//change div back to original_categories
							hideDivs();
							showDiv("original");
							current_piece = piece;
						}
					});
				}
				

					current_piece.categories.forEach(function(category) {
						category = category.toLowerCase();
						if (result.search(category) > -1)
						{
							hideDivs();
							if (result.match(category) == "about the artist"){
								play_audio(true, current_piece.artist_details.audio_on_load+","+current_piece.artist_details.audio_on_load);
								showDiv("artist");
							}
							if ((result.match(category) == "about the piece") || (result.match(category) == "about the peace")) {
								play_audio(true, current_piece.piece_details.audio_on_load+","+current_piece.piece_details.audio_on_load);
								showDiv("piece");
							}
						}
					});
				

					for (prop in current_piece.artist_details) {
						if (result.search(prop) > -1)
						{							
							if (result.match(prop) == "biography"){
								play_audio(true, current_piece.artist_details.biography);
							}
							else if (result.match(prop) == "career") {
								play_audio(true, current_piece.artist_details.career);
							}
						}
					}

					for (prop in current_piece.piece_details) {
						if (result.search(prop) > -1)
						{
							if (result.match(prop) == "style"){
								play_audio(true, current_piece.piece_details.style);
							}
							else if (result.match(prop) == "medium") {
								play_audio(true, current_piece.piece_details.medium);
							}						
						}
					}
				if(!played && result.indexOf("~") > -1){
					play_audio(true, "https://s3.amazonaws.com/RamaAudio/sorry.wav");
				}
				played = false;
			});					
	}	

}
