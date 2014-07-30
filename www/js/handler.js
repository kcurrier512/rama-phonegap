

var continue_playing = true;

function play_audio(doc, audio)
{
	alert(audio);
	audio_array = audio.split(',');
	if (audio_array.length == 1)
	{
		doc.src = audio_array[0];
		doc.play();
	}  
	else  
	{
		for (var i=0; i<audio.length; i++)
		{
			if (continue_playing == true) 
			{
				
				doc.src = audio_array[i];
				var duration = audio_array[i].duration;
				doc.play();
				setTimeout(function(){alert("Continue or enough?");},duration);
			}
		}
	}
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
            result = result.toLowerCase();
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
							document.getElementById("current_title").innerHTML = name;
							//change div back to original_categories
							hideDivs();
							showDiv("original");
							current_piece = piece;
						}
					});
				}
				audio_player = document.getElementById("audio-player");
				

				if (document.getElementById("original_categories").style.display != "none")
				{
					current_piece.categories.forEach(function(category) {
						category = category.toLowerCase();
						if (result.search(category) > -1)
						{
							hideDivs();
							if (result.match(category) == "about the artist"){
								play_audio(audio_player, current_piece.artist_details.audio_on_load)
								showDiv("artist");
							}
							else if (result.match(category) == "about the piece") {
								play_audio(audio_player, current_piece.piece_details.audio_on_load);
								showDiv("piece");
							}
						}
					});
				}
				else if (document.getElementById("artist_categories").style.display != "none")
				{
					for (prop in current_piece.artist_details) {
						if (result.search(prop) > -1)
						{							
							if (result.match(prop) == "biography"){
								play_audio(audio_player, current_piece.artist_details.biography);
							}
							else if (result.match(prop) == "career") {
								play_audio(audio_player, current_piece.artist_details.career);
							}
						}
					}
				}
				else if (document.getElementById("piece_categories").style.display != "none")
				{
				
					for (prop in current_piece.piece_details) {
						if (result.search(prop) > -1)
						{
							if (result.match(prop) == "style"){
								play_audio(audio_player, current_piece.piece_details.style);
							}
							else if (result.match(prop) == "medium") {
								play_audio(audio_player, current_piece.piece_details.medium);
							}						
						}
					}
				}		
			});					
	}	

}
