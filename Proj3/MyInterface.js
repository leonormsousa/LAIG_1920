/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();
        return true;    
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addLights(){
         for(let i=0; i<this.scene.numLights;i++)
            this.gui.add(this.scene, 'displayLight'+i).name("Display "+i);       
    }

    addCameras(cameras){
        this.gui.add(this.scene, 'selectedCamera', cameras).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    addLook(views) {

        var group = this.gui.addFolder("Look");
        group.open();

        var names = [];

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                names[key] = views[key].name;
            }
        }

        group.add(this.scene, 'Current_View', names).name("Theme");
    }

}