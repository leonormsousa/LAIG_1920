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

    getHoldingTile(){
        return this.holdingTile;
    }

    getPlayer(){
        return this.player;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.holdingTile.x, this.holdingTile.z, this.holdingTile.y);
        this.scene.graph.processNode(this.componentId, mat4.create(), this.materialId, 'none', 1, 1, false, true, true);
        this.scene.popMatrix();
    }
}