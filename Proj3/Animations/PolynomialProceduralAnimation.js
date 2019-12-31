/**
 * PolynomialProceduralAnimation
 */
class PolynomialProceduralAnimation extends Animation {
	constructor(scene, id, translation, scaling, rotating, stoping_time){
        super(scene);
        this.id=id;

        this.translation=translation;
        this.scaling=scaling;
        this.rotating=rotating;
        this.stoping_time=stoping_time
       
        this.initial_time=0;
        this.previous_t=0;
        this.matrix=mat4.create();
    }
    
    update(t){
        if (this.initial_time==0){
            this.initial_time=t;
            this.previous_t=t;
        }

        //delta is the time since t0
        var delta=t-this.initial_time;
        if (this.stoping_time!= null && delta>this.stoping_time)
            delta=this.stoping_time;
        
        //calculations of translation, scaling and rotation
        var t=[0, 0, 0], s=[0, 0, 0], r=[0, 0, 0];
        for (let j=0; j<3; j++){
            for (let i=0; i<this.translation[j].length; i++)
                t[j] += this.translation[j][i] * Math.pow(delta, i);
        }
        for (let j=0; j<3; j++){
            for (let i=0; i<this.scaling[j].length; i++)
                s[j] += this.scaling[j][i] * Math.pow(delta, i);
        }
        for (let j=0; j<3; j++){
            for (let i=0; i<this.rotation[j].length; i++)
                r[j] += this.rotation[j][i] * Math.pow(delta, i);
        }

        //applying animation
        this.matrix=mat4.create();
        mat4.translate(this.matrix, this.matrix, [t[0], t[1], t[2]]);
        mat4.scale(this.matrix, this.matrix, [s[0], s[1], s[2]]);   
        mat4.rotateX( this.matrix, this.matrix, r[0]);
        mat4.rotateY( this.matrix, this.matrix, r[1]);
        mat4.rotateZ( this.matrix, this.matrix, r[2]);
        this.previous_t=t;
    };

    apply(mult){
        mat4.multiply(mult, mult, this.matrix);
    };
}