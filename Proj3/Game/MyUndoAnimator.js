/**
 * MyUndoAnimator
 */
class MyUndoAnimator extends CGFobject {
	constructor(scene, gameMove) {
        super(scene);
        this.gameMove = gameMove; 
        this.over=false; 

        this.stopingTime=3;

        //y calculations
        let c=1.1;
        let q=8.9/(18.9-this.gameMove.destinationTile1.z);
        let a=(q-Math.sqrt(q*q-4*q*q*(-c*q+c-10+this.gameMove.destinationTile1.z*q)))/(2*q*q);
        let b=-a-c+this.gameMove.destinationTile1.z;
        //x and z calculations
        let x1=gameMove.originTile1.x*Math.sqrt(3)/2;
        let x2=gameMove.destinationTile1.x*Math.sqrt(3)/2;
        let z1=-gameMove.originTile1.y*1.5;
        let z2=-gameMove.destinationTile1.y*1.5;
        this.animation1 = new PolynomialProceduralAnimation(scene, "1", [[x1, (x2-x1)/1], [c, b, a], [z1, (z2-z1)/1]], [[1], [1], [1]], [[0], [0], [0]], 1);

        if (this.gameMove.movedPiece2 != null){
            //y calculations
            c=1.1;
            q=8.9/(18.9-this.gameMove.destinationTile1.z);
            a=(q-Math.sqrt(q*q-4*q*q*(-c*q+c-10+this.gameMove.destinationTile1.z)))/(2*q*q);
            b=-a-c+this.gameMove.destinationTile1.z;
            //x and z calculations
            x1=gameMove.originTile2.x*Math.sqrt(3)/2;
            x2=gameMove.destinationTile2.x*Math.sqrt(3)/2;
            z1=-gameMove.originTile2.y*1.5;
            z2=-gameMove.destinationTile2.y*1.5;
            this.animation2 = new PolynomialProceduralAnimation(scene, "2", [[x1, (x2-x1)/1], [c, b, a], [z1, (z2-z1)/1]], [[1], [1], [1]], [[0], [0], [0]], 1);
        }

        if (this.gameMove.movedPiece2 != null)
            this.animation2.started=true;
        else
            this.animation1.started=true;
    }

    update(t){
        if (this.gameMove.movedPiece2 != null){
            if(this.animation1.over)
                this.over=true;
            else if(this.animation2.over)
                this.animation1.started=true;
            this.animation2.update(t/1000);
        }
        else{
            if(this.animation1.over)
                this.over=true;
        }
        this.animation1.update(t/1000);
        console.log(this.animation1);
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