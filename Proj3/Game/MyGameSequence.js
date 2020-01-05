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

    undoGameMove(gameboard){
        let lastMove = this.gameMoves[this.gameMoves.length-1];

        // let reverseMove = new MyGameMove(this.scene, lastMove.movedPiece1, lastMove.destinationTile1, lastMove.originTile1, lastMove.movedPiece2, lastMove.destinationTile2, lastMove.originTile2, gameboard);
        gameboard.movePiece(lastMove.movedPiece1, lastMove.originTile1.x, lastMove.originTile1.y);
        gameboard.movePiece(lastMove.movedPiece2, lastMove.originTile2.x, lastMove.originTile2.y);

      //  reverseMove.animate();
        this.gameMoves.pop();
        return gameboard;
    }

    moveReplay(){

        // for(let i=0; i<this.gameMoves.length; i++){
        //     this.gameMoves[i]
        // }
    }
}