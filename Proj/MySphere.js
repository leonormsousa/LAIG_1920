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

        this.vertices.push(0, 0, -this.radius)
        this.normals.push(0, 0, -1);
        //stack numero 1
        for(let i = 0; i < this.slices; i++)
        {
            var x=Math.cos(i * angle)*Math.cos(delta-Math.PI/2);
            var y=Math.sin(i * angle)*Math.cos(delta-Math.PI/2);
            var z=Math.sin(delta-Math.PI/2);
            this.vertices.push(x*this.radius, y*this.radius, z*this.radius);
            this.normals.push(x,y,z);             
            this.texCoords.push( (Math.cos(i * angle)), Math.sin(delta-Math.PI/2));					

            this.indices.push(0, (i+1)+1, i+1);
        }

        var x=Math.cos(delta-Math.PI/2);
        var y=0;
        var z=Math.sin(delta-Math.PI/2);
        this.vertices.push(x*this.radius, y*this.radius, z*this.radius);
        this.normals.push(x,y,z);             
        this.texCoords.push(1, 0);	

		for(let j = 1; j < (2*this.stacks); j++)
		{		
            for(let i = 0; i < this.slices; i++)
            {
                var x=Math.cos(i * angle)*Math.cos(j*delta - Math.PI/2);
                var y=Math.sin(i * angle)*Math.cos(j*delta - Math.PI/2);
                var z=Math.sin(j*delta - Math.PI/2);
                this.vertices.push(x*this.radius, y*this.radius, this.radius*z);
                this.normals.push(x,y,z);            
                this.texCoords.push( (Math.cos(i * angle)), -(Math.sin(i * angle)));					

                this.indices.push(1+(this.slices+1)*j+(i+1), 1+(this.slices+1)*j+i, 1+(this.slices+1)*(j-1)+i);
                this.indices.push(1+(this.slices+1)*(j-1)+i, 1+(this.slices+1)*(j-1)+(i+1), 1+(this.slices+1)*j+(i+1));
            }

            var x=Math.cos(j*delta - Math.PI/2);
            var y=0;
            var z=Math.sin(j*delta - Math.PI/2);
            this.vertices.push(x*this.radius, y*this.radius, this.radius*z);
            this.normals.push(x,y,z);            
            this.texCoords.push(1, 0);	
        }
        
        //ultima stack
        this.vertices.push(0,0, this.radius);
        this.normals.push(0,0, 1);
        for(let i = 0; i < this.slices; i++)
            this.indices.push(1+(this.slices+1)*(2*this.stacks-1)+i+1, 1+(this.slices+1)*(2*this.stacks), 1+(this.slices+1)*(2*this.stacks-1)+i);
        
		this.primitiveType=this.scene.gl.TRIANGLES;

        this.initGLBuffers();
	};
};