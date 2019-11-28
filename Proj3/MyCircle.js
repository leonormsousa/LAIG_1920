/**
 * MyCircle
 */
class MyCircle extends CGFobject {
	constructor(scene, id, radius, slices) {
		super(scene);
		this.slices=slices;
		this.radius=radius;
		this.initBuffers();
	}
	initBuffers() {
		let i=0, j=0;
		this.vertices=[];
		this.normals=[];
		this.indices=[];
		this.texCoords = [];
		var delta = 2*Math.PI/this.slices;

        this.vertices.push(0,0,0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

		for (i=0; i<=this.slices; i++)
		{
			this.vertices.push(Math.cos(delta*i)*this.radius, 0, (-Math.sin(delta*i))*this.radius);
			this.normals.push(0, 1, 0);
			this.texCoords.push(Math.cos(delta*i)/2*this.radius+0.5, (-Math.sin(delta*i))*this.radius/2+0.5);
            this.indices.push(0, i+1, i+2);
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	changeTexCoords(length_s, length_t){
		this.texCoords = [];
		var delta = 2*Math.PI/this.slices;
		this.texCoords.push(0.5/length_s, 0.5/length_t);
		for (let i=0; i<=this.slices; i++)
			this.texCoords.push((Math.cos(delta*i)/2*this.radius+0.5)/length_s, ((-Math.sin(delta*i))*this.radius/2+0.5)/length_t);
	};
}

