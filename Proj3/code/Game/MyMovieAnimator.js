/**
 * MyMovieAnimator
 */
class MyMovieAnimator extends MyAnimator {
	constructor(scene, gameMoves) {
        super(scene);
        this.over=false;
        this.animations = [];
        this.pieces = [];
        for (let i=0; i<gameMoves.length; i++){
            if (gameMoves[i].movedPiece1 != null)
                this.animations.push(new MyMoveAnimator(scene, gameMoves[i]));
            this.pieces.push(gameMoves[i].movedPiece1, gameMoves[i].movedPiece2);
        }
    }

    update(t){
        for (let i=0; i<this.animations.length; i++){
            if(!this.animations[i].over){
                this.animations[i].update(t);
                break;
            }
        }
        if (this.animations[this.animations.length-1].over)
            this.over=true;
    }

    display(){
        for (let i=0; i<this.animations.length; i++)
            this.animations[i].display();
    }
}