/**
 * TrigonometricProceduralAnimation
 */
class TrigonometricProceduralAnimation extends Animation {
    //translation/scaling/rotating = [[sinx, cosx, tanx, constx], [siny, cosy, tany, consty], [sinz, cosz, tanz, constz]]
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
            t[j] = this.translation[j][0]*Math.sin(delta) + this.translation[j][1]*Math.cos(delta) + this.translation[j][2]*Math.tan(delta) + this.translation[j][3];
        }
        for (let j=0; j<3; j++){
            s[j] = this.scaling[j][0]*Math.sin(delta) + this.scaling[j][1]*Math.cos(delta) + this.scaling[j][2]*Math.tan(delta) + this.scaling[j][3];
        }
        for (let j=0; j<3; j++){
            r[j] = this.rotating[j][0]*Math.sin(delta) + this.rotating[j][1]*Math.cos(delta) + this.rotating[j][2]*Math.tan(delta) + this.rotating[j][3];
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