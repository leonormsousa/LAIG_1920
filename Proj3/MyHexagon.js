/**
 * MyHexagon
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyHexagon extends CGFobject {
	constructor(scene, id, radius) {
        super(scene);
        this.radius=radius;
		this.initBuffers();
	}
	
	initBuffers() {
        //      1
        //  2       6
        //      0
        //  3       5
        //      4
		this.vertices = [
            0, 0, 0,                              //Center        //0
            0, 0, 1*this.radius,                                  //1  
            -this.radius*Math.sqrt(3)/2, 0, this.radius/2,        //2
            -this.radius*Math.sqrt(3)/2, 0, -this.radius/2,       //3
            0, 0, -this.radius,                                   //4 
            this.radius*Math.sqrt(3)/2, 0, -this.radius/2,        //5 
            this.radius*Math.sqrt(3)/2, 0, this.radius/2,         //6
		];

		this.indices = [
            0, 2, 1,
            0, 3, 2,
            0, 4, 3, 
            0, 5, 4,
            0, 6, 5,
            0, 1, 6
		];

		//Facing Z positive
		this.normals = [
            0, 1, 0,    //0
            0, 1, 0,    //1
            0, 1, 0,    //2
            0, 1, 0,    //3
            0, 1, 0,    //4
            0, 1, 0,    //5
            0, 1, 0,    //6
		];

		this.changeTexCoords(1,1);
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	changeTexCoords(length_s, length_t){
		this.texCoords = [
            0.5/length_s, 0.5/length_t,
            0.5/length_s, 1/length_t,
            0, 0.8333/length_t,
            0, 0.1667/length_t,
            0.5/length_s, 0,
            1/length_s, 0.1667/length_t,
            1/length_s, 0.8333/length_t
		]
		this.updateTexCoords(this.texCoords);
	}
}
