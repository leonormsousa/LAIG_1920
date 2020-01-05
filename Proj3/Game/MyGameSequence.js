/**
 * MyGameSequence
 */
class MyGameSequence extends CGFobject {
	constructor(scene) {
        super(scene);
        this.gameMoves=[];
    }

    addGameMove(gameMove){
        this.gameMoves.push(gameMove);
    }

    getGameMoves(){
        return this.gameMoves;
    }

    undoGameMove(gameboard){
        let lastMove = this.gameMoves[this.gameMoves.length-1];
        let reverseMove = new MyGameMove(this.scene, 1, lastMove.movedPiece1, lastMove.destinationTile1, lastMove.originTile1, lastMove.movedPiece2, lastMove.destinationTile2, lastMove.originTile2, gameboard);
        
        if (lastMove.movedPiece1 != null)
            gameboard.movePiece(lastMove.movedPiece1, lastMove.originTile1.x, lastMove.originTile1.y, lastMove.originTile1.z);
        if (lastMove.movedPiece2 != null)
            gameboard.movePiece(lastMove.movedPiece2, lastMove.originTile2.x, lastMove.originTile2.y, lastMove.originTile2.z);
        
        this.gameMoves.pop();
        return reverseMove;
    }

    moveReplay(){

        // for(let i=0; i<this.gameMoves.length; i++){
        //     this.gameMoves[i]
        // }
    }
}