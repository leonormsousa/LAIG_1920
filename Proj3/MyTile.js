/**
 * MyTile
 */
class MyTile extends CGFobject {
	constructor(scene, componentId, materialId, x, y, z) {
        super(scene);
        this.piece = null;
        this.componentId = componentId;
        this.materialId = materialId;
        this.x=x;
        this.y=y;
        this.z=z;
    }

    setPiece(piece){
        this.piece=piece;
    }

    unsetPiece(){
        this.piece=null;
    }

    getPiece(){
        return this.piece;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.z, this.y);
        this.scene.graph.processNode(this.componentId, mat4.create(), this.materialId, 'none', 1, 1);
        this.scene.popMatrix();
    }
}