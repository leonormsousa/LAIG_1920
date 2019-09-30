/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
		];

		this.indices = [
			0, 2, 1
		];

		var c=1;
		var b= ((this.z1-this.z2)*(this.x3-this.x2)- (this.z3-this.z2)*(this.x1-this.x2))/
				((this.y3-this.y2)*(this.x1-this.x2)-(this.y1-this.y2)*(this.x3-this.x2));
		var a=(-b*(this.y1-this.y2)-c*(this.z1-this.z2))/(this.x1-this.x2);
		var norma=Math.sqrt(a*a+b*b+c*c);
		a=a/norma;
		b=b/norma;
		c=c/norma;


		//Facing Z positive
		this.normals = [
			a,b,c,
			a,b,c,
			a,b,c
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
		]
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
}

