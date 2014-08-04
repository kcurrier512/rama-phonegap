
var sp = {

recognize: function(){
        navigator.speechrecognizer.recognize(successCallback, failCallback, 1, "Please say a command");
    
        function successCallback(results){
            var result = JSON.stringify(results)
            result = result.substring(2, result.length - 2);
            alert(result);
            redirect(result);
		}


    
        function failCallback(error){
            alert("Could you please try again?  I didn't catch that.");
            console.log("Error: " + error);
        }
    }
};

function redirect(result){
	
	result = result.toLowerCase();

	handler.setContinuePlaying(true);  //needs to reset it here
	//before doing anything, record the response in the responses database
	handler.record(result);
	
    if((result.indexOf("blue white") > -1) || (result.indexOf("kelly") > -1) || (result.indexOf("blue/white") > -1)){
        handler.load('blue white');
        roseApp.showView('Painting');
    }
    else if((result.indexOf("forget") > -1) || (result.indexOf("lichtenstein") > -1) || (result.indexOf("liechtenstein") > -1)){
        handler.load('forget it! forget me!');
        roseApp.showView('Painting');
    }
    else if(result.indexOf("gallery") > -1){
        roseApp.showView('gallery');
    }
    else if(result.indexOf("home") > -1){
        roseApp.showView('welcome');
    }
    else if(result.indexOf("help") > -1){
        roseApp.showView('help');
    }
    else if (result.indexOf("back") > -1){
		hideDivs(); 
		showDiv('original');
		pause_audio();
	}
    else if ((result.indexOf("yes") > -1) || (result.indexOf("yeah") > -1) ||  (result.indexOf("okay") > -1) || (result.indexOf("ok") > -1)){
        handler.setContinuePlaying(true);
    }
    else if ((result.indexOf("stop") > -1) || (result.indexOf("nope") > -1) || (result.indexOf("no") > -1) || (result.indexOf("pause") > -1)){
        handler.setContinuePlaying(false);
    }
    else{
        handler.load(result);
    } 
 
}
