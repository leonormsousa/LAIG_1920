/**
 * MyCylinder
 */
class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.slices=slices;
		this.base=base;
		this.top=top;
		this.height=height;
		this.stacks=stacks;
		this.initBuffers();
	}
	initBuffers() {
		let i=0, j=0;
		this.vertices=[];
		this.normals=[];
		this.indices=[];
		this.texCoords = [];
		var delta = 2*Math.PI/this.slices;
		var delta_y = this.height/this.stacks;

		//vértices da face de baixo
		for (i=0; i<=this.slices; i++)
		{
			this.vertices.push(Math.cos(delta*i)*this.base,0,(-Math.sin(delta*i))*this.base);
			this.normals.push(Math.cos(delta*i),0,(-Math.sin(delta*i)));
			this.texCoords.push(i/(this.slices), 0);
		}

		for (j=0; j<this.stacks; j++)
		{
			var radiusTop=  this.top*((j+1)/this.stacks) + this.base*(this.stacks-(j+1))/this.stacks;

			for (i=0; i<=this.slices; i++)
			{
				//vértices da face de cima
				this.vertices.push(Math.cos(delta*i)*radiusTop,(j+1)*delta_y,-Math.sin(delta*i)*radiusTop);
				this.normals.push(Math.cos(delta*i),0,-Math.sin(delta*i));
				this.texCoords.push(i/(this.slices), j/this.stacks);
				//definição das faces
				this.indices.push(j*(this.slices+1)+i,j*(this.slices+1)+i+1,(j+1)*(this.slices+1)+i);
				this.indices.push((j+1)*(this.slices+1)+i+1,(j+1)*(this.slices+1)+i, j*(this.slices+1)+i+1);
			}
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

