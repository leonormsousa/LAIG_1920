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
                requestString += ',';
        }
        requestString+=']';

        let request = new XMLHttpRequest();
        request.addEventListener("load", onSuccess);
        request.addEventListener("error", onError); 

        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
        request.setRequestHeader("Content-type", "application/x-www-formurlencoded; charset=UTF-8");
        request.send();
    }

    //  ----------------------  request handlers  ----------------------------
    validMovesRequest(board, player){
        this.sendPrologRequest([this.ValidMoves, board, player], this.validMovesReply);
    }

    movePieceRequest(move){
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
        this.sendPrologRequest([this.ChooseMove, board, lever, player], this.chooseMoveReply);
    }

    startRequest(){
        this.sendPrologRequest([this.Start], this.startReply);
    }


    responseStringToArray(response){
        return JSON.parse(response);
    }

    //  ----------------------  responses handlers  ----------------------------
    //returns validMoves array in the form [player, line1, column1, line2, column2]
    validMovesReply(data) {
        let response_array = responseStringToArray(data.target.response);
        return response_array[1];
    }

    //if move was possible returns the new board, otherwise returns null
    movePieceReply(data){
        let response_array = responseStringToArray(data.target.response);
        if (response_array[0] == this.OK)
            return response_array[1];
        else
            return null;
    }

    //returns true if game is over or false otherwise
    gameOverReply(data){
        let response_array = responseStringToArray(data.target.response);
        if (response_array[0] == this.Full)
            return true;
        else
            return false;
    }
        
    //returns number of points
    calculatePointsReply(data){
        let response_array = responseStringToArray(data.target.response);
        return response_array[1];
    }   
    
    //return number of player who won (1 or 2); if it was a tie returns null
    calculateWinnerReply(data){
        let response_array = responseStringToArray(data.target.response);
        if (response_array[0] == this.Tie)
            return null;
        else
            return response_array[1];
    }

    //returns move chosen
    chooseMoveReply(data){
        let response_array = responseStringToArray(data.target.response);
        return response_array[1];
    }

    //returns the initial Board
    startReply(data){
        let response_array = responseStringToArray(data.target.response);
        return response_array[1];
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
MyPrologInterface.prototype.OK = 0;
MyPrologInterface.prototype.Failed = 1;
MyPrologInterface.prototype.Full = 2;
MyPrologInterface.prototype.Tie = 3;