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

    undoGameMove(){
        let lastMove = this.gameMoves[this.gameMoves.length-1];
        let reverseMove = new gameMove(this.scene, lastMove.movedPiece, lastMove.destinationTile, lastMove.originTile, null);
        reverseMove.animate();
        this.gameMoves.pop();
        this.gameBoards.pop();
    }

    moveReplay(){
        //dont know what its suposed to do
    }
}