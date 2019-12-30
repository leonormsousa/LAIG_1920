/**
 * MyGameMove
 */
class MyGameMove extends CGFobject {
	constructor(scene, movedPiece1, originTile1, destinationTile1, movedPiece2, originTile2, destinationTile2, beforeGameBoard) {
        super(scene);
        this.movedPiece1=movedPiece1;
        this.originTile1=originTile1;
        this.destinationTile1=destinationTile1;
        this.movedPiece2=movedPiece2;
        this.originTile2=originTile2;
        this.destinationTile2=destinationTile2;
        this.beforeGameBoard=beforeGameBoard;
    }

    animate(){
        //animation
    }
}