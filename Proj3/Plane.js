/**
 * Plane
 */
class Plane extends CGFobject {
	constructor(scene, primitiveId, div_u, div_v) {
        super(scene);
        this.primitiveId=primitiveId;
        this.div_u = div_u;
        this.div_v = div_v;
        this.surface = new CGFnurbsSurface(1, 1, [ [ [-0.5, 0, 0.5, 1], [-0.5, 0, -0.5, 1] ], [ [0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1] ] ]);
        this.object = new CGFnurbsObject(scene, div_u, div_v, this.surface);
        //this.object.initBuffers();
	}

    changeTexCoords(length_s, length_t){};
    
    display(){
        this.object.display();
    }
}

