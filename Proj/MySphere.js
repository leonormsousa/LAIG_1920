class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks)
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

		for(let j = 0; j < this.stacks; j++)
		{		
            var rad = this.radius*Math.cos(j*delta);

            for(let i = 0; i <= this.slices; i++)
            {

                this.vertices.push(Math.cos(i * angle)*rad, this.radius*Math.sin(j*delta), Math.sin(i * angle)*rad);

                this.normals.push((Math.cos(i * angle)*rad)/this.radius, (this.radius*Math.sin(j*delta))/this.radius, (Math.sin(i * angle)*rad)/this.radius);
                                
                this.texCoords.push( (Math.cos(i * angle)*rad ) / 2.0 + 0.5, -(Math.sin(i * angle)*rad) / 2.0 + 0.5);					

                if(j != 0 && i != 0)
                {
                    this.indices.push((this.slices+1)*j + i - 1, (this.slices+1)*(j-1) + i - 1, (this.slices+1)*(j-1) + i);
                    this.indices.push((this.slices+1)*j + i - 1,(this.slices+1)*(j-1) + i,  (this.slices+1)*(j-1) + i - 1);

                    this.indices.push((this.slices+1)*j + i - 1, (this.slices+1)*(j-1) + i , (this.slices+1)*j + i);
                    this.indices.push((this.slices+1)*j + i - 1, (this.slices+1)*j + i, (this.slices+1)*(j-1) + i );

                }
            }
		}
        
        this.vertices.push(Math.cos((this.slices-1) * angle)*Math.cos(Math.asin(1*(this.stacks))), Math.sin((this.slices-1) * angle)*Math.cos(Math.asin(1*(this.stacks))), this.stacks * 1);
        this.normals.push(Math.cos((this.slices-1) * angle), Math.sin((this.slices-1) * angle), Math.cos(Math.asin(1*(this.stacks))));
        this.texCoords.push(0.5,0.5);
        for(let i = 0; i <= this.slices; i++)
        {
            this.indices.push((this.slices+1)*this.stacks,(this.slices+1)*(this.stacks-1) + i, (this.slices+1)*(this.stacks-1) + i + 1);	
            this.indices.push((this.slices+1)*this.stacks,(this.slices+1)*(this.stacks-1) + i + 1, (this.slices+1)*(this.stacks-1) + i);							
        }	
			
		this.primitiveType=this.scene.gl.TRIANGLES;
        
        
        
        
        
        
        
        this.initGLBuffers();
	};
};