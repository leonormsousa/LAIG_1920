class MySphere extends CGFobject
{
	constructor(scene, id, radius, slices, stacks)
	{
		super(scene);
        this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var angle = (2* Math.PI) / this.slices;
		var delta = (Math.PI/2) / this.stacks;

        //polo sul
        for(let i = 0; i < this.slices+1; i++)
        {
            this.vertices.push(0, 0, -this.radius)
            this.normals.push(0, 0, -1);
            this.texCoords.push(i/this.slices,0);
        }

        //stack numero 1
        for(let i = 0; i <= this.slices; i++)
        {
            var x=Math.cos(i * angle)*Math.cos(delta-Math.PI/2);
            var y=Math.sin(i * angle)*Math.cos(delta-Math.PI/2);
            var z=Math.sin(delta-Math.PI/2);
            this.vertices.push(x*this.radius, y*this.radius, z*this.radius);
            this.normals.push(x,y,z);             
            this.texCoords.push(i/this.slices, 1/(2*this.stacks));				

            this.indices.push(i, this.slices+1+i+1, this.slices+1+i);
        }	

        //stacks intermédias
		for(let j = 1; j < (2*this.stacks); j++)
		{		
            for(let i = 0; i <= this.slices; i++)
            {
                var x=Math.cos(i * angle)*Math.cos(j*delta - Math.PI/2);
                var y=Math.sin(i * angle)*Math.cos(j*delta - Math.PI/2);
                var z=Math.sin(j*delta - Math.PI/2);
                this.vertices.push(x*this.radius, y*this.radius, this.radius*z);
                this.normals.push(x,y,z);            
                this.texCoords.push(i/this.slices, j/(2*this.stacks));					

                this.indices.push(this.slices+1+(this.slices+1)*j+(i+1), this.slices+1+(this.slices+1)*j+i, this.slices+1+(this.slices+1)*(j-1)+i);
                this.indices.push(this.slices+1+(this.slices+1)*(j-1)+i, this.slices+1+(this.slices+1)*(j-1)+(i+1), this.slices+1+(this.slices+1)*j+(i+1));
            }	
        }
        
        //ultima stack
        for(let i = 0; i < this.slices; i++)
        {   
            this.vertices.push(0,0, this.radius);
            this.normals.push(0,0, 1);
            this.texCoords.push();
            this.texCoords.push(i/this.slices, 1);
            this.indices.push((this.slices+1)+(this.slices+1)*(2*this.stacks-1)+i+1, (this.slices+1)+(this.slices+1)*(2*this.stacks)+i, (this.slices+1)+(this.slices+1)*(2*this.stacks-1)+i);
        } 
        
		this.primitiveType=this.scene.gl.TRIANGLES;

        this.initGLBuffers();
	};
};