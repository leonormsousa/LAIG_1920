/**
 * MyGameOrchestrator
 */
class MyGameOrchestrator extends CGFobject {
	constructor(scene) {
        super(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(scene, this);
        this.gameboard = new MyGameboard(scene);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	    // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	    var filename=getUrlVars()['file'] || "lxs.xml";
        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        this.theme = new MySceneGraph(filename, scene);

        this.prolog = new MyPrologInterface(scene);
        
        this.state = "start";
        this.scene.setPickEnabled(false);
        this.currentPlayer=1;
        this.level=1;
        this.number_passes=0;
        this.moveToExecute = [];
        // index 0 for player1 and index 1 for player 2. false is human, true is pc
        this.player=[false, false];

        //buttons for game
        this.undoButton = new MyButton(scene, "button2", "undo");
        this.exitButton = new MyButton(scene, "button2", "exit");
        this.movieButton = new MyButton(scene, "button2", "movie");
        this.confirmButton = new MyButton(scene, "button1", "confirm");
        this.removeButton = new MyButton(scene, "button1", "remove");
        this.playerVsPlayer = new MyButton(scene, "button1","playerVSplayer");
        this.playerVsPc = new MyButton(scene, "button1", "playerVSpc");
        this.pcVsPc = new MyButton(scene,"button1", "pcVSpc");
        this.startGame = new MyButton(scene, "button1", "startGame");
        this.easyButton = new MyButton(scene, "button1", "easy");
        this.mediumButton = new MyButton(scene, "button1", "medium");
        this.hardButton = new MyButton(scene, "button1", "hard");
    }

    update(time) {
        this.animator.update(time);
    }

    renderMove(){
        let moveReply = this.prolog.response;
        this.prolog.response = null

        let destinationTile1 = this.gameboard.getTileByCoordinates(this.moveToExecute[2], this.moveToExecute[1]);
        destinationTile1.selected=false;
        let destinationTile2;
        if (this.moveToExecute[3] != null){
            destinationTile2 = this.gameboard.getTileByCoordinates(this.moveToExecute[4], this.moveToExecute[3]);
            destinationTile2.selected=false;
        }

        if (moveReply == false){
            alert("Move Not Possible!");
            this.state="pick first tile human";
            return;
        }

        this.number_passes=0;
        let pieceToMove1=this.gameboard.getFirstPieceFreeToMove(this.moveToExecute[0]);
        let originTile1 = this.gameboard.getTileHoldingPiece(pieceToMove1);
        this.gameboard.movePiece(pieceToMove1, this.moveToExecute[2], this.moveToExecute[1]);
        if (this.moveToExecute[3] == null)
            this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, null, null, null, this.gameboard));
        else{
            let pieceToMove2 = this.gameboard.getFirstPieceFreeToMove(this.moveToExecute[0]);
            let originTile2 = this.gameboard.getTileHoldingPiece(pieceToMove2);
            this.gameboard.movePiece(pieceToMove2, this.moveToExecute[4], this.moveToExecute[3]);
            let move = new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, pieceToMove2, originTile2, destinationTile2, this.gameboard)
            this.gameSequence.addGameMove(move);
           // move.animate();
        }

        this.currentPlayer = (this.currentPlayer % 2) + 1;
        this.moveToExecute=[];
        this.state = "animation";
    }

    undo(){
        this.gameboard = this.gameSequence.undoGameMove(this.gameboard);
        this.currentPlayer = (this.currentPlayer % 2) + 1;
        if (this.number_passes>0)
            this.number_passes--;
        //activate animation
        this.state="animation";
    }

    movie(){
        //activate animation
        this.state="animation";
    }

     orchestrate(){
        switch(this.state){
            case "start":
                this.scene.setPickEnabled(true);
                break;
            case "menu":
                this.scene.setPickEnabled(true);
                break;
            case "pick difficulty":
                this.scene.setPickEnabled(true);
                break;
            case "loading":
                this.scene.setPickEnabled(false);
                break;

            case "pick first tile human":
                this.scene.setPickEnabled(true);
                break;

            case "pick second tile human":
                this.scene.setPickEnabled(true);
                break;

            case "pick tiles pc":
                this.scene.setPickEnabled(false);

                //wait for eventListener to end work
                if (this.prolog.response != null){
                    if (this.prolog.response.length == 0){
                        console.log("shit");
                        let move = new MyGameMove(this.scene, this.moveToExecute[0], null, null, null, null, null, null, this.gameboard);
                        this.gameSequence.addGameMove(move);
                        this.number_passes++;
                        this.currentPlayer = (this.currentPlayer % 2) + 1;
                        this.state = "game end evaluation";
                        if (this.number_passes<2)
                            this.prolog.gameOverRequest(this.gameboard.convertToPrologBoard());
                    }
                    else{
                        console.log("ola");
                        this.moveToExecute[0] = this.currentPlayer;
                        for(let i=0; i<this.prolog.response.length; i++)
                            this.moveToExecute[i+1] = this.prolog.response[i];
                        this.prolog.response = null
                        this.state="render move";
                        sleep(2);
                        this.prolog.movePieceRequest(this.moveToExecute, this.gameboard.convertToPrologBoard());
                    }               
                }
                break;

            case "render move":
                this.scene.setPickEnabled(false);
                //wait for response
                if (this.prolog.response != null){
                    this.renderMove();
                }
                break;

            case "animation":
                this.scene.setPickEnabled(false);
                //verificar se já atingiu stoping_time da animação
                this.prolog.response = null

                this.state = "game end evaluation";
               // if (this.number_passes<2)
                    this.prolog.gameOverRequest(this.gameboard.convertToPrologBoard());
                break;

            case "game end evaluation":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
               // if (this.number_passes>=2 || this.prolog.response != null){
                   if(this.prolog.response != null){
                    let resp = this.prolog.response;
                    this.prolog.response = null
                    if (this.number_passes>=2 || resp){
                        console.log(resp);
                        this.state="calculate points 1";
                        this.prolog.calculatePointsRequest(this.gameboard.convertToPrologBoard(), 1);
                    }
                    else if (this.player[this.currentPlayer-1]){
                        this.state="pick tiles pc";
                        this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
                    }
                    else
                        this.state="pick first tile human"; 
                }  
                break;

            case "calculate points 1":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    console.log(this.prolog.response);
                    this.points1 = this.prolog.response;
                    this.prolog.response=null;

                    if(this.points1.length == 0)
                        this.points1 = [0];
                    
                    this.state="calculate points 2";
                    this.prolog.calculatePointsRequest(this.gameboard.convertToPrologBoard(), 2);
                }
                break;
                
            case "calculate points 2":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    this.points2 = this.prolog.response;
                    this.prolog.response=null;
              
                    if(this.points2.length == 0)
                        this.points2 = [0]
                    
                    console.log(this.points1);
                    console.log(this.points2);
                    this.prolog.calculateWinnerRequest(this.points1, this.points2);
                    this.state="calculate winner";
                }
                break;
            case "calculate winner":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    let winner = this.prolog.response;
                    this.prolog.response=null;

                    let msg;
                    if (winner == 0)
                        msg="It's a Tie";
                    else
                        msg = "The winner is Player " + winner;
                    msg += "!\n" + "Group points by Player 1: " + this.points1 + "\nGroup points by Player 2: " + this.points2;
                    alert(msg);
                    this.state="menu";
                }
                break;
            case "undo":
                this.scene.setPickEnabled(false);
                this.undo();
                this.state="pick first tile human";
                break;
            case "movie":
                this.scene.setPickEnabled(false);
                break;
        }
    }

    display() {
        this.orchestrate();

        this.managePick();
        this.scene.clearPickRegistration();
        let numberPickedObjects=1;

        

        //still need to work out id numbers and picking objects of the scene
        this.theme.render(numberPickedObjects);
        numberPickedObjects++;

        //buttons
        this.scene.pushMatrix();
        if(this.state == "start"){
            this.scene.translate(-3, 0, 0);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.scene.translate(0, -1, 2);
            this.scene.registerForPick(numberPickedObjects++, this.startGame);
            this.startGame.display();
        }
        else if(this.state == "menu"){
            this.scene.translate(-3, 0, 0);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.scene.translate(0, 3, 2);
            this.scene.registerForPick(numberPickedObjects++, this.playerVsPlayer);
            this.playerVsPlayer.display();
            this.scene.translate(0, -2.5, 0);
            this.scene.registerForPick(numberPickedObjects++, this.playerVsPc);
            this.playerVsPc.display();
            this.scene.translate(0, -2.5, 0);
            this.scene.registerForPick(numberPickedObjects++, this.pcVsPc);
            this.pcVsPc.display();
        }
        else if(this.state == "pick difficulty"){
            this.scene.translate(-3, 0, 0);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.scene.translate(0, 3, 2);
            this.scene.registerForPick(numberPickedObjects++, this.easyButton);
            this.easyButton.display();
            this.scene.translate(0, -2.5, 0);
            this.scene.registerForPick(numberPickedObjects++, this.mediumButton);
            this.mediumButton.display();
            this.scene.translate(0, -2.5, 0);
            this.scene.registerForPick(numberPickedObjects++, this.hardButton);
            this.hardButton.display();
        }
        else{ 
            if (this.state == "pick first tile human" || this.state == "pick second tile human")
                numberPickedObjects = this.gameboard.display(true);
            else
                this.gameboard.display(false);
            this.scene.translate(-3, 0, 0);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.scene.translate(-20, -15, 0.1);
            this.scene.registerForPick(numberPickedObjects++, this.undoButton);
            this.undoButton.display();
            this.scene.translate(10, 0, 0);
            this.scene.registerForPick(numberPickedObjects++, this.removeButton);
            this.removeButton.display();
            this.scene.translate(10, 0, 0);
            this.scene.registerForPick(numberPickedObjects++, this.confirmButton);
            this.confirmButton.display();
            this.scene.translate(10,0, 0);
            this.scene.registerForPick(numberPickedObjects++, this.movieButton);
            this.movieButton.display();
            this.scene.translate(10, 0, 0);
            this.scene.registerForPick(numberPickedObjects++, this.exitButton);
            this.exitButton.display();
        }
        this.scene.popMatrix();       

        this.scene.clearPickRegistration();
        this.animator.display();
    }
     
    //add reaction to select buttons like undo (call function undo()), movie (call functionn movie()), exit, etc.
    onObjectSelected(obj, id) {
        if(obj instanceof MyTile){
            obj.selected=true;
            if (this.state == "pick first tile human"){
                this.moveToExecute = [this.currentPlayer, obj.y, obj.x];
                this.state = "pick second tile human";
            }
            else if (this.state == "pick second tile human"){
                this.moveToExecute.push(obj.y, obj.x);
                this.state="waiting confirm";
            }
        }
        else if (obj == this.confirmButton){
            if (this.state == "waiting confirm" || this.state == "pick first tile human" || this.state == "pick second tile human"){
                if (this.moveToExecute.length == 0){
                    let move = new MyGameMove(this.scene, this.moveToExecute[0], null, null, null, null, null, null, this.gameboard);
                    this.gameSequence.addGameMove(move);
                    this.number_passes++;
                    this.currentPlayer = (this.currentPlayer % 2) + 1;
                    this.state = "game end evaluation";
                    if (this.number_passes<2)
                        this.prolog.gameOverRequest(this.gameboard.convertToPrologBoard());
                }
                else{
                    this.prolog.movePieceRequest(this.moveToExecute, this.gameboard.convertToPrologBoard());
                    this.state="render move";
                }
            }
        }
        else if (obj == this.removeButton){
            if (this.state == "waiting confirm" || this.state == "pick second tile human"){
                let destinationTile1 = this.gameboard.getTileByCoordinates(this.moveToExecute[2], this.moveToExecute[1]);
                destinationTile1.selected=false;
                if (this.state == "waiting confirm"){
                    let destinationTile2 = this.gameboard.getTileByCoordinates(this.moveToExecute[4], this.moveToExecute[3]);
                    destinationTile2.selected=false;
                }
                this.moveToExecute = [];
                this.state = "pick first tile human";
            }
        }
        else if (obj == this.undoButton){
            this.gameboard = this.gameSequence.undoGameMove(this.gameboard);
            this.state="pick first tile human";
        }
        else if(obj == this.movieButton){

        }
        else if(obj == this.startGame){
            this.state = "menu";
        }
        else if(obj == this.playerVsPlayer){
            this.state="pick first tile human";
        }
        else if(obj == this.playerVsPc){
            this.player=[false, true];
            this.state="pick difficulty";
        }
        else if(obj == this.pcVsPc){
            this.player=[true, true];
            this.state= "pick difficulty";
      //      this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);

        }
        else if(obj == this.easyButton){
            this.level = 1;
            if(this.player[0]){
                this.state ="pick tiles pc";
                this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
            }
            else
                this.state="pick first tile human"
        }
        else if(obj == this.mediumButton){
            this.level = 2;
            if(this.player[0]){
                this.state ="pick tiles pc";
                this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
            }
            else
                this.state="pick first tile human"

        }
        else if(obj == this.hardButton){
            this.level = 3;
            if(this.player[0]){
                this.state ="pick tiles pc";
                this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
            }
            else
                this.state="pick first tile human"
        }
        else if(obj == this.exitButton){
            this.gameboard = new MyGameboard(this.scene);
            this.state="start";
        }
        else {
            console.log("Error: I can't happen!");
        }
    }

    managePick() {
        if (this.scene.pickMode == false /* && some other game conditions */){
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) { // any results?
                for (var i=0; i< this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = this.scene.pickResults[i][1] // get id
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
               
}

const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}