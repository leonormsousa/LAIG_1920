/**
 * MyGameMove
 */
class MyGameMove extends CGFobject {
	constructor(scene, movedPiece, originTile, destinationTile, beforeGameBoard) {
        super(scene);
        this.movedPiece=movedPiece;
        this.originTile=originTile;
        this.destinationTile=destinationTile;
        this.beforeGameBoard=beforeGameBoard;
    }

    animate(){
        //animation
    }
}