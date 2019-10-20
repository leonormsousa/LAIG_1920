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

        for(let i=0; i<=this.slices; i++){
            this.vertices.push(this.outer + this.inner*Math.cos(i*angle), 0, this.inner*Math.sin(i*angle));
            this.normals.push(Math.cos(i*angle),0, Math.sin(i*angle));            
            this.texCoords.push(i/this.slices,0);			
        }

		for(let j = 1; j <= this.loops; j++)
		{		
            for(let i = 0; i < this.slices; i++)
            {
                this.vertices.push((this.outer + this.inner*Math.cos(i*angle))*Math.cos(j*delta), (this.outer + this.inner*Math.cos(i*angle))*Math.sin(j*delta), this.inner*Math.sin(i*angle));
                this.normals.push(Math.cos(i*angle)*Math.cos(j*delta), Math.cos(i*angle)*Math.sin(j*delta), Math.sin(i*angle));            
                this.texCoords.push(i/this.slices, j/this.loops);					

                this.indices.push((this.slices+1)*(j-1)+i, (this.slices+1)*j+ i+1, (this.slices+1)*(j-1)+ i+1,);
                this.indices.push((this.slices+1)*(j-1)+i,(this.slices+1)*j+ i, (this.slices+1)*j+ i+1);
            }	
            //vertices extra para cada slice
            this.vertices.push((this.outer + this.inner)*Math.cos(j*delta), (this.outer + this.inner)*Math.sin(j*delta), 0);
            this.normals.push(Math.cos(j*delta), Math.sin(j*delta), 0);            
            this.texCoords.push(1, j/this.loops);
        }
        
		this.primitiveType=this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    };
    
    changeTexCoords(length_s, length_t){};
};