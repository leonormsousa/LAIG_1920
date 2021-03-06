/**
 * Animation
 */
class KeyframeAnimation extends CGFobject {
	constructor(scene, id, keyframes){
        super(scene);
        this.id=id;
        this.keyframes=keyframes;
        this.keyframes.sort((a, b) => (a.instant > b.instant) ? 1 : -1);
        if(this.keyframes[0].instant != 0)
        {
           this.keyframes.push(new Keyframe(scene, 0, 0,0,0,0,0,0,1,1,1)); 
           this.keyframes.sort((a, b) => (a.instant > b.instant) ? 1 : -1);
        } 
    
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
        var f=-1;
        for (var i=0; i<this.keyframes.length; i++){
            if (this.keyframes[i].instant > delta){
                f=i;
                break;
            }
        }

        if (f==-1)
            return;
        var keyframe1 = this.keyframes[f-1];
        var keyframe2 = this.keyframes[f];

        //delta_t represents the time since this function was lastly called
        var delta_t = t - this.previous_t;
        //n is the number of times the function is called betwen keyframe1.instant and keyframe2.instant
        var n = (keyframe2.instant-keyframe1.instant)/(delta_t);
        //current n represents how many times the function has been called since keyframe1.instant
        var current_n = (delta-keyframe1.instant)/delta_t;

        var rx=keyframe1.rx*Math.PI/180 + (keyframe2.rx - keyframe1.rx)*Math.PI/180*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        var ry=keyframe1.ry*Math.PI/180 + (keyframe2.ry - keyframe1.ry)*Math.PI/180*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        var rz=keyframe1.rz*Math.PI/180 + (keyframe2.rz - keyframe1.rz)*Math.PI/180*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        var tx=keyframe1.tx + (keyframe2.tx - keyframe1.tx)*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        var ty=keyframe1.ty + (keyframe2.ty - keyframe1.ty)*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        var tz=keyframe1.tz + (keyframe2.tz - keyframe1.tz)*(delta-keyframe1.instant)/(keyframe2.instant-keyframe1.instant);
        
        var sx, sy, sz;

        //scale sx
        if ((keyframe2.sx*keyframe1.sx) <= 0)
        {
            var d = 1 - Math.min(keyframe2.sx, keyframe1.sx);
            var sx1 = keyframe1.sx + d;
            var sx2 = keyframe2.sx + d;
            sx = sx1 * Math.pow(Math.pow(sx2/sx1, 1/n), current_n) - d;
        }
        else
            sx=keyframe1.sx*Math.pow(Math.pow(keyframe2.sx/keyframe1.sx, 1/n), current_n);

        //scale sy
        if ((keyframe2.sy*keyframe1.sy) <= 0)
        {
            var d = 1 - Math.min(keyframe2.sy, keyframe1.sy);
            var sy1 = keyframe1.sy + d;
            var sy2 = keyframe2.sy + d;
            sy = sy1 * Math.pow(Math.pow(sy2/sy1, 1/n), current_n) - d;
        }
        else
            sy=keyframe1.sy*Math.pow(Math.pow(keyframe2.sy/keyframe1.sy, 1/n), current_n);

        //scale sz
        if ((keyframe2.sz*keyframe1.sz) <= 0)
        {
            var d = 1 - Math.min(keyframe2.sz, keyframe1.sz);
            var sx1 = keyframe1.sz + d;
            var sx2 = keyframe2.sz + d;
            sx = sz1 * Math.pow(Math.pow(sz2/sz1, 1/n), current_n) - d;
        }
        else
            sz=keyframe1.sz*Math.pow(Math.pow(keyframe2.sz/keyframe1.sz, 1/n), current_n);

        this.matrix=mat4.create();
        mat4.translate(this.matrix, this.matrix, [tx, ty, tz]);
        mat4.scale(this.matrix, this.matrix, [sx, sy, sz]);   
        mat4.rotateX( this.matrix, this.matrix, rx);
        mat4.rotateY( this.matrix, this.matrix, ry);
        mat4.rotateZ( this.matrix, this.matrix, rz);
        this.previous_t=t;
    };

    apply(mult){
        mat4.multiply(mult, mult, this.matrix);
    };
}