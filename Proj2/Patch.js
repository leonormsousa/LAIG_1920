/**
 * Patch
 */
class Patch extends CGFobject {
	constructor(scene, primitiveId, npointsU, npointsV, npartsU, npartsV, points) {
        super(scene);

        this.primitiveId=primitiveId;
        this.surface = new CGFnurbsSurface(npointsU-1, npointsV-1, points);
        this.object = new CGFnurbsObject(scene, npartsU, npartsV, this.surface);
        this.object.initBuffers();
	}

    changeTexCoords(length_s, length_t){};
    
    display(){
        this.object.display();
    }
}

