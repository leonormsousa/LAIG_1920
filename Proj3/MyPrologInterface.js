/**
 * MyPrologInterface
 */
class MyPrologInterface{
	constructor() {}

    sendPrologRequest(listArgs, onSuccess, onError, port){
        let requestPort = port || 8081;

        //building a string containing list of arguments;
        let requestString = '[';
        for (let i=0; i<listArgs.length; i++){
            requestString += listArgs[i].toString();
            if (i<listArgs.length-1)
                requestString += ', ';
        }
        requestString+=']';

        let request = new XMLHttpRequest();
        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
        request.setRequestHeader("Content-type", "application/x-www-formurlencoded; charset=UTF-8");
        request.send();
    }

    textStringToArray(){}

    handleReply(data) {
        if (this.status === 400) {
            console.log("ERROR");
            return;
        }
        // the answer here is: [Board,CurrentPlayer,WhiteScore,BlackScore]
        console.log(this.responseText)
        let responseArray = textStringToArray(this.responseText,true);
        // do something with responseArray[0];
        // do something with responseArray[1];
        // do something with responseArray[2];
        // do something with responseArray[3];
    }
        
}

//defining constants to be easier to work with the code
MyPrologInterface.prototype.ValidMoves = 1;
MyPrologInterface.prototype.MovePiece = 2;
MyPrologInterface.prototype.GameOver = 3;
MyPrologInterface.prototype.CalculatePoints = 4;
MyPrologInterface.prototype.CalculateWinner = 5;
MyPrologInterface.prototype.ChooseMove = 6;
MyPrologInterface.prototype.OK = 0;
MyPrologInterface.prototype.Failed = 1;
MyPrologInterface.prototype.Full = 2;
MyPrologInterface.prototype.Tie = 3;