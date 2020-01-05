/**
 * MyButton
 */
class MyButton extends CGFobject {
	constructor(scene, materialId, textureId) {
        super(scene);
        this.scene=scene;
        this.materialId = materialId;
        this.textureId = textureId;

        this.rectangle = new MyRectangle(scene, 'rectangle1', 0, 6, 0, 2);
    }

    display(){
        let mat = new CGFappearance(this.scene);
        mat = this.scene.graph.materials[this.materialId];

        mat.setTexture(this.scene.graph.textures[this.textureId]);
        mat.setTextureWrap('REPEAT', 'REPEAT');          
        mat.apply();
        this.rectangle.display();
    }
}