/**
 * MySecurityCamera
 */
class MySecurityCamera extends CGFobject{
	constructor(scene, texture){
        super(scene);
        this.texture=texture;
        this.rectangle = new MyRectangle(scene, 0, 0.5, 1, -1, -0.5);
    }

    display(){
        this.texture.bind();
        this.rectangle.display();
        this.texture.unbind();
    }
}