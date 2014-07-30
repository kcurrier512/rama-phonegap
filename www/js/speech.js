
var sp = {

recognize: function(){
        navigator.speechrecognizer.recognize(successCallback, failCallback, 1, "Please say a command");
    
        function successCallback(results){
            var result = JSON.stringify(results)
            result = result.substring(2, result.length - 2);
            alert(results);
            redirect(result);
            handler.load(result);
            /*if (result.match("continue") == "continue" || result.match("more")=="more" or result.match("go on") == "go on")
            {
				handler.setContinuePlaying(true);
			}
			else if (result.match("stop") == "stop" || result.match("enough") == "enough" || result.match("pause") == "pause")
			{
				handler.setContinuePlaying(false);
			}
			else
			{
				handler.load(result);
			} */
        }
    
        function failCallback(error){
            alert("Could you please try again?  I didn't catch that.");
            console.log("Error: " + error);
        }
    }
}
function redirect(result){
    result = result.toLowerCase();
    if((result.indexOf("blue white") > -1) || (result.indexOf("kelly") > -1) || (result.indexOf("blue/white") > -1)){
        handler.load('Blue White');
        roseApp.showView('Painting');
    }
    else if((result.indexOf("forget") > -1) || (result.indexOf("lichtenstein") > -1) || (result.indexOf("liechtenstein") > -1)){
        handler.load('Forget it! Forget me!');
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
}
