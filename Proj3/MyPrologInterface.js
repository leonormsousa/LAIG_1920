/**
 * MyPrologInterface
 */
class MyPrologInterface{
	constructor() {
        this.request = null;
    }

    toStringObject(listArgs){
        let str="";
        for (let i=0; i<listArgs.length; i++){
            if (Array.isArray(listArgs[i]))
                str+='[' + this.toStringObject(listArgs[i]) +']';
            else
                str += listArgs[i];
            if (i<listArgs.length-1)
                str += ',';
        }
        return str;
    }

    sendPrologRequest(listArgs, onSuccess, onError, port){
        //building a string containing list of arguments;
        let requestString = '[' + this.toStringObject(listArgs) + ']';

        self=this;

        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    //  ----------------------  request handlers  ----------------------------
    validMovesRequest(board, player){
        this.sendPrologRequest([this.ValidMoves, board, player], this.validMovesReply);
    }

    movePieceRequest(move, board){
        if (move[3] == null)
            this.sendPrologRequest([this.MovePiece, [move[0], move[1], move[2], [], []], board], this.movePieceReply);
        else
            this.sendPrologRequest([this.MovePiece, move, board], this.movePieceReply);
    }

    gameOverRequest(board){
        this.sendPrologRequest([this.GameOver, board], this.gameOverReply);
    }

    calculatePointsRequest(board, player){
        this.sendPrologRequest([this.CalculatePoints, board, player], this.calculatePointsReply);
    }

    calculateWinnerRequest(points1, points2){
        this.sendPrologRequest([this.CalculateWinner, points1, points2], this.calculateWinnerReply);
    }

    chooseMoveRequest(board, level, player){
        this.sendPrologRequest([this.ChooseMove, board, level, player], this.chooseMoveReply);
    }

    startRequest(){
        this.sendPrologRequest([this.Start], this.startReply);
    }

    //  ----------------------  responses handlers  ----------------------------
    //returns validMoves array in the form [player, line1, column1, line2, column2]
    validMovesReply(data) {
        let response_array = JSON.parse(data.target.response);
        self.response=response_array[1];
    }

    //if move was possible returns the new board, otherwise returns null
    movePieceReply(data){
        let response_array = JSON.parse(data.target.response);
        if (response_array[0] == self.Ok)
            self.response=response_array[1];
        else
            self.response=false;
    }

    //returns true if game is over or false otherwise
    gameOverReply(data){
        let response_array = JSON.parse(data.target.response);
        console.log(response_array);
        if (response_array[0] == self.Full)
            self.response= true;
        else
            self.response= false;
    }
        
    //returns number of points
    calculatePointsReply(data){
        let response_array = JSON.parse(data.target.response);
        console.log(response_array);
            self.response= response_array[1];
    }   
    
    //return number of player who won (1 or 2); if it was a tie returns null
    calculateWinnerReply(data){
        let response_array = JSON.parse(data.target.response);
        if (response_array[0] == self.Tie)
            self.response= 0;
        else
            self.response= response_array[1];
    }

    //returns move chosen
    chooseMoveReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
    }

    //returns the initial Board
    startReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
    }

    handleReply(data){
        self.response= data.target.response;
    }
}

//defining constants to be easier to work with the code
MyPrologInterface.prototype.ValidMoves = 1;
MyPrologInterface.prototype.MovePiece = 2;
MyPrologInterface.prototype.GameOver = 3;
MyPrologInterface.prototype.CalculatePoints = 4;
MyPrologInterface.prototype.CalculateWinner = 5;
MyPrologInterface.prototype.ChooseMove = 6;
MyPrologInterface.prototype.Start = 7;
MyPrologInterface.prototype.Ok = 0;
MyPrologInterface.prototype.Failed = 1;
MyPrologInterface.prototype.Full = 2;
MyPrologInterface.prototype.Tie = 3;