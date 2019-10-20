/**
 * MyComponent
 */
class MyComponent extends CGFobject {
	constructor(scene, id, transformation_matrix, materials, texture, length_s, length_t, childrenPrimitives, childrenComponents) {
        super(scene);
        this.id=id;
        this.transformation_matrix = transformation_matrix;
        this.materials = materials;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
        this.childrenPrimitives = childrenPrimitives;
        this.childrenComponents = childrenComponents;
        this.material_number=0;
    }
    incrementMaterialNumber(){
        this.material_number=this.material_number+1;
        this.material_number=this.material_number%(this.materials.length);
    }

    getCurrentMaterial(){
        return this.materials[this.material_number];
    }
}

