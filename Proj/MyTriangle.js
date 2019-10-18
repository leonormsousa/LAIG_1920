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

		var nz = ((this.x2-this.x1)*(this.y3-this.y1)-(this.y2-this.y1)*(this.x3-this.x1));
		var ny = ((this.z2-this.z1)*(this.x3-this.x1)- (this.x2-this.x1)*(this.z3-this.z1));
		var nx = ((this.x2-this.x1)*(this.y3-this.y1)-(this.y2-this.y1)*(this.x3-this.x1));
		var norma=Math.sqrt(nx*nx+ny*ny+nz*nz);
		nx=nx/norma;
		ny=ny/norma;
		nz=nz/norma;


		//Facing Z positive
		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz
		];

		var v1=Math.sqrt(Math.pow(this.x2-this.x1,2)+Math.pow(this.y2-this.y1,2)+Math.pow(this.z2-this.z1,2));
		var v2=Math.sqrt(Math.pow(this.x3-this.x2,2)+Math.pow(this.y3-this.y2,2)+Math.pow(this.z3-this.z2,2));
		var v3=Math.sqrt(Math.pow(this.x1-this.x3,2)+Math.pow(this.y1-this.y3,2)+Math.pow(this.z1-this.z3,2));

		var cosac=(v1*v1-v2*v2+v3*v3)/(2*v1*v2);
		var sinac= Math.sqrt(1-Math.pow(cosac,2));

		this.texCoords = [
			0, 0,
			v1, 0,
			(v3*cosac), (v3*sinac)
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

	changeTexCoords(length_s, length_t){
		this.texCoords = [
			0, 0,
			v1/length_s, 0,
			(v3*cosac)/length_s, (v3*sinac)/length_t
		]
		this.updateTexCoords(this.texCoords);
	}
}

