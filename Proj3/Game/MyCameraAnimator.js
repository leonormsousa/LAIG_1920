/**
 * MyCameraAnimator
 */
class MyCameraAnimator extends MyAnimator {
	constructor(scene, originCamera, destinationCamera, duration) {
        super(scene);
        this.over=false;
        this.initial_time=0;
        this.previous_t=0;
        this.duration=duration;
        this.originCamera=originCamera;
        this.destinationCamera=destinationCamera;
    }

    update(t){
        if (this.initial_time==0){
            this.initial_time=t/1000;
            this.previous_t=t/1000;
        }

        //delta is the time since t0
        var delta=t/1000-this.initial_time;

        if (delta>this.duration){
            delta=this.duration;
            this.over=true;
        }

        let fov=delta*(this.destinationCamera.fov - this.originCamera.fov)/this.duration+this.originCamera.fov;
        let near=delta*(this.destinationCamera.near - this.originCamera.near)/this.duration+this.originCamera.near;
        let far=delta*(this.destinationCamera.far - this.originCamera.far)/this.duration+this.originCamera.far;
        let position=[delta*(this.destinationCamera.position[0] - this.originCamera.position[0])/this.duration+this.originCamera.position[0], delta*(this.destinationCamera.position[1] - this.originCamera.position[1])/this.duration+this.originCamera.position[1], delta*(this.destinationCamera.position[2] - this.originCamera.position[2])/this.duration+this.originCamera.position[2]];
        let target=[delta*(this.destinationCamera.target[0] - this.originCamera.target[0])/this.duration+this.originCamera.target[0], delta*(this.destinationCamera.target[1] - this.originCamera.target[1])/this.duration+this.originCamera.target[1], delta*(this.destinationCamera.target[2] - this.originCamera.target[2])/this.duration+this.originCamera.target[2]];

        let camera = new CGFcamera(fov, near, far, position, target);
        this.scene.interface.setActiveCamera(camera);
        this.scene.camera=camera;
        console.log(camera);
    }

    display(){
    }
}