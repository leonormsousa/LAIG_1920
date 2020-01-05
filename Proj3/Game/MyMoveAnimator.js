/**
 * MyMoveAnimator
 */
class MyMoveAnimator extends MyAnimator {
	constructor(scene, gameMove) {
        super(scene);
        this.gameMove = gameMove; 
        this.pieces=[];
        this.over=false; 

        this.stopingTime=3;
        //y calculations
        let c=this.gameMove.originTile1.z;
        let q=1-(10/(20-c));
        let a=(q-Math.sqrt(q*q-4*q*q*(-c*q+c-10+1.1)))/(2*q*q);
        let b=-a-c+1.1;
        //x and z calculations
        let x1=gameMove.originTile1.x*Math.sqrt(3)/2;
        let x2=gameMove.destinationTile1.x*Math.sqrt(3)/2;
        let z1=-gameMove.originTile1.y*1.5;
        let z2=-gameMove.destinationTile1.y*1.5;
        this.animation1 = new PolynomialProceduralAnimation(scene, "1", [[x1, (x2-x1)/1], [c, b, a], [z1, (z2-z1)/1]], [[1], [1], [1]], [[0], [0], [0]], 1);
        this.pieces.push(gameMove.movedPiece1);

        if (this.gameMove.movedPiece2 != null){
            //y calculations
            c=this.gameMove.originTile2.z;
            q=1-(10/(20-c));
            a=(q-Math.sqrt(q*q-4*q*q*(-c*q+c-10+1.1)))/(2*q*q);
            b=-a-c+1.1;
            //x and z calculations
            x1=gameMove.originTile2.x*Math.sqrt(3)/2;
            x2=gameMove.destinationTile2.x*Math.sqrt(3)/2;
            z1=-gameMove.originTile2.y*1.5;
            z2=-gameMove.destinationTile2.y*1.5;
            this.animation2 = new PolynomialProceduralAnimation(scene, "2", [[x1, (x2-x1)/1], [c, b, a], [z1, (z2-z1)/1]], [[1], [1], [1]], [[0], [0], [0]], 1);
            this.pieces.push(gameMove.movedPiece2);
        }
        this.animation1.started=true;
    }

    update(t){
        if (this.gameMove.movedPiece2 != null){
            if(this.animation2.over)
                this.over=true;
            else if(this.animation1.over)
                this.animation2.started=true;
            this.animation2.update(t/1000);
        }
        else{
            if(this.animation1.over)
                this.over=true;  
        }
        this.animation1.update(t/1000);
    }

    display(){
        let mat = mat4.create();
        this.animation1.apply(mat);
        this.gameMove.movedPiece1.display(mat);
        if (this.gameMove.movedPiece2 != null){
            mat = mat4.create();
            this.animation2.apply(mat);
            this.gameMove.movedPiece2.display(mat);
        }
    }
}