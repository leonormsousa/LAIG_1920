class MyTorus extends CGFobject
{
	constructor(scene, id, inner, outer, slices, loops)
	{
		super(scene);
        this.inner = inner;
        this.outer = outer;
		this.slices = slices;
		this.loops = loops;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var angle = (2 * Math.PI) / this.slices;
		var delta = (2 * Math.PI) / this.loops;

		for(let j = 0; j < this.loops; j++)
		{		
            for(let i = 0; i < this.slices; i++)
            {
                this.vertices.push((this.outer + this.inner*Math.cos(angle))*Math.cos(delta), (this.outer + this.inner*Math.cos(angle))*Math.sin(delta), this.inner*Math.sin(angle));
                this.normals.push(Math.cos(angle)*Math.cos(delta), Math.cos(angle)*Math.sin(delta), Math.sin(angle));            
                this.texCoords.push(i/this.slices, j/this.loops);					

                this.indices.push((this.slices+1)*j+i, (this.slices+1)*j+ i+1, (this.slices+1)*(j+1)+ i+1);
                this.indices.push((this.slices+1)*j+i, (this.slices+1)*(j+1)+ i, (this.slices+1)*(j+1)+ i+1);
            }	
            //vertices extra para cada slice
            this.vertices.push((this.outer + this.inner)*Math.cos(delta), (this.outer + this.inner)*Math.sin(delta), 0);
            this.normals.push(Math.cos(delta), Math.sin(delta), 0);            
            this.texCoords.push(1, j/this.loops);
        }

        //vertices extra para a loop final
        this.vertices.push(this.outer + this.inner, 0, 0);
        this.normals.push(1, 0, 0);            
        this.texCoords.push(1, 1);
        
		this.primitiveType=this.scene.gl.TRIANGLES;

        this.initGLBuffers();
	};
};