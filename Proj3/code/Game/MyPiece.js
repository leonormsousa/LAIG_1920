/**
 * MyPiece
 */
class MyPiece extends CGFobject {
	constructor(scene, player, componentId, materialId) {
        super(scene);
        this.holdingTile=null;
        this.player = player;
        this.componentId = componentId;
        this.materialId=materialId;
    }

    setHoldingTile(tile){
        this.holdingTile=tile;
    }
    unsetHoldingTile(){
        this.holdingTile = null;
    }

    getHoldingTile(){
        return this.holdingTile;
    }

    getPlayer(){
        return this.player;
    }

    display(mat){
        this.scene.pushMatrix();
        if (mat == undefined)
            this.scene.translate(this.holdingTile.x*Math.sqrt(3)/2, this.holdingTile.z, -this.holdingTile.y*1.5);
        else
            this.scene.multMatrix(mat);
        this.scene.graph.processNode(this.componentId, mat4.create(), this.materialId, 'none', 1, 1, false, true, true);
        this.scene.popMatrix();
    }
}