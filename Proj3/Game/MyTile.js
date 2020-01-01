/**
 * MyTile
 */
class MyTile extends CGFobject {
	constructor(scene, componentId, materialId, x, y, z, auxiliary) {
        super(scene);
        this.piece = null;
        this.componentId = componentId;
        this.materialId = materialId;
        this.x=x;
        this.y=y;
        this.z=z;
        this.auxiliary=auxiliary;
        if (auxiliary)
            this.selectable=false;
        else
            this.selectable=true;
        this.selected=false;
    }

    setPiece(piece){
        this.piece=piece;
        this.selectable = false;
    }

    unsetPiece(){
        this.piece=null;
        if (!this.auxiliary)
            this.selectable = true;
    }

    getPiece(){
        return this.piece;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.x*Math.sqrt(3)/2, this.z, -this.y*1.5);
        if (this.selected)
            this.scene.graph.processNode(this.componentId, mat4.create(), "black", 'tile', 1, 1, true, true);
        else
            this.scene.graph.processNode(this.componentId, mat4.create(), this.materialId, 'tile', 1, 1, true, true);
        this.scene.popMatrix();
    }
}