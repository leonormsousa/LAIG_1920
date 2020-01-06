/**
 * Cylinder2
 */
class Cylinder2 extends CGFobject {
	constructor(scene, primitiveID, base, top, height, slices, stacks) {
        super(scene);
        this.primitiveID=primitiveID;
        
        var points1 = [ [ [-top, 0, height, 1], [-base, 0, 0, 1] ], [ [-top, 4*top/3, height, 1], [-base, 4*base/3, 0, 1] ], [ [top, 4*top/3, height, 1], [base, 4*base/3, 0, 1] ], [ [top, 0, height, 1], [base, 0, 0, 1] ] ];
        var points2 = [ [ [-base, 0, 0, 1], [-top, 0, height, 1] ], [ [-base, -4*base/3, 0, 1], [-top, -4*top/3, height, 1] ], [ [base, -4*base/3, 0, 1], [top, -4*top/3, height, 1] ], [ [base, 0, 0, 1] , [top, 0, height, 1] ] ];

        this.surface1 = new CGFnurbsSurface(3, 1, points1);
        this.object1 = new CGFnurbsObject(scene, stacks, slices/2, this.surface1);
        this.object1.initBuffers();

        this.surface2 = new CGFnurbsSurface(3, 1, points2);
        this.object2 = new CGFnurbsObject(scene, stacks, slices/2, this.surface2);
        this.object2.initBuffers();
	}

    changeTexCoords(length_s, length_t){};
    
    display(){
        this.object1.display();
        this.object2.display();
    }
}

