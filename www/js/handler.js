
var played = false;

var continue_playing = true;

var my_media = null;
var duration = 0;


function info(){
	alert(window.location.hash);
	alert(location.hash);
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







function play_audio(ifPlayed, url) {
   url_array = url.split(',');
   if (url_array.length==1)
   {

    // Play the audio file at url
    my_media = new Media(url_array[0],
        // success callback
        function() {
            alert("playAudio():Audio Success");
        },
        // error callback
        function(err) {
            alert("playAudio():Audio Error: "+err);
    });

    // Play audio
    my_media.play();
    played = ifPlayed;
   }
   else if (url_array.length > 1)
   {
   	for (var i=0; i<url_array.length; i++)
   	{
   		if (continue_playing == false)
   		{
   			alert('continue playing is false');
   			return;
   		}
   			
   			
   		my_media = new Media(url_array[i],
        	// success callback
		   function() {
            		console.log("playAudio():Audio Success");
        		},
		  // error callback
		  function(err) {
        		 console.log("playAudio():Audio Error: "+err);
    			});

    		// Play audio
		 my_media.play();
		 played = ifPlayed;
   			
		 
       var counter = 0;
       var duration = 0;
    var timerDur = setInterval(function() {
        counter = counter + 100;
        if (counter > 2000) {
            clearInterval(timerDur);
        }
        var dur = my_media.getDuration();
        if (dur > 0) {
            clearInterval(timerDur);
            duration = dur;
            //return;
        }
   }, 100);
	alert(duration+"d"):

   		 
   		 
	}
   }
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
	if (continue_playing == false)
		document.getElementById("audio-player").pause();
}, 

load: function(result)
{
            var pieces = [];
            serverURL = "http://leiner.cs-i.brandeis.edu:9000";
			

            //load database pieces into variable pieces
    		$.ajax({
        		type: "GET",
        		url: serverURL + "/pieces",
    		}).done(function(db_pieces) {
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
				 //document.getElementById("audio-player");
				

					current_piece.categories.forEach(function(category) {
						category = category.toLowerCase();
						if (result.search(category) > -1)
						{
							hideDivs();
							if (result.match(category) == "about the artist"){
								play_audio(true, current_piece.artist_details.audio_on_load)
								showDiv("artist");
							}
							if ((result.match(category) == "about the piece") || (result.match(category) == "about the peace")) {
								play_audio(true, current_piece.piece_details.audio_on_load);
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
