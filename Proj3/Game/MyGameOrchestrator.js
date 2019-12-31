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
        // index 0 for player1 and index 1 for player 2. false is human, true is pc
        this.player=[false, false];
    }

    update(time) {
        this.animator.update(time);
    }

    menu(){
        this.state="pick first tile human";

    }

    renderMove(){
        let moveReply = this.prolog.response;
        this.prolog.response = null
        let destinationTile1;
        let destinationTile2;
        console.log(this.moveToExecute);
        if(this.moveToExecute[1] != []){
            destinationTile1 = this.gameboard.getTileByCoordinates(this.moveToExecute[2], this.moveToExecute[1]);
            destinationTile1.selected=false;
        }
        if (this.moveToExecute[3] != []){
            destinationTile2 = this.gameboard.getTileByCoordinates(this.moveToExecute[4], this.moveToExecute[3]);
            destinationTile2.selected=false;
        }
        console.log(this.gameboard);
        console.log(destinationTile1);
        console.log(destinationTile2);
        if (moveReply == false){
            alert("Move Not Possible!");
            this.state="pick first tile human";
            return;
        }
        if(this.moveToExecute[1] == []){
            this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], null, null, null, null, null, null, this.gameboard));
            this.number_passes++;
        }
        else{
            this.number_passes=0;
            let pieceToMove1=this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
            let originTile1 = this.gameboard.getTileHoldingPiece(pieceToMove1);
            this.gameboard.movePiece(pieceToMove1, this.moveToExecute[1], this.moveToExecute[2]);
            if (this.moveToExecute[3] == [])
                this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, null, null, null, this.gameboard));
            else{
                let pieceToMove2 = this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
                let originTile2 = this.gameboard.getTileHoldingPiece(pieceToMove2);
                this.gameboard.movePiece(pieceToMove2, this.moveToExecute[3], this.moveToExecute[4]);
                this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, pieceToMove2, originTile2, destinationTile2, this.gameboard));
            }
        }
        this.currentPlayer = (this.currentPlayer % 2) + 1;
        this.state = "animation";
    }

    undo(){
        this.gameboard = this.gameSequence.undoGameMove();
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
                this.state="menu";
                this.menu();
                break;
            case "menu":
                this.scene.setPickEnabled(true);

                break;
            case "loading":
                this.scene.setPickEnabled(false);

                break;
            case "pick first tile human":
                this.scene.setPickEnabled(true);
                //still missing button for move with no tiles -> create an object MyButton and do the same procedure as fr Tile
                break;
            case "pick second tile human":
                this.scene.setPickEnabled(true);
                //still missing button for move with only one tiles -> onObjectSelected
                break;
            case "pick tiles pc":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    this.moveToExecute = this.prolog.response;
                    this.prolog.response = null
                    this.state="render move";
                    sleep(2);
                    this.prolog.movePieceRequest(this.moveToExecute, this.gameboard.convertToPrologBoard());
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
                this.state = "game end evaluation";
                this.prolog.gameOverRequest(this.gameboard.convertToPrologBoard()) || this.number_passes>=2;
                break;
            case "game end evaluation":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    let resp = this.prolog.response;
                    this.prolog.response = null
                    if (resp){
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
                    this.points1 = this.prolog.response;
                    this.prolog.calculatePointsRequest(this.gameboard.convertToPrologBoard(), 2);
                    this.prolog.response=null;
                }
                break;
            case "calculate points 2":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    this.points2 = this.prolog.response;
                    this.prolog.calculateWinnerRequest(this.points1, this.points2);
                    this.prolog.response=null;
                }
                break;
            case "calculate winner":
                this.scene.setPickEnabled(false);
                //wait for eventListener to end work
                if (this.prolog.response != null){
                    let winner = this.prolog.response;
                    this.prolog.response=null;

                    let msg;
                    if (winner == null)
                        msg="It's a Tie";
                    else
                        msg = "The winner is Player " + winner;
                    msg += "!\n" + "Group points by Player 1: " + this.points1 + "\nGroup points by Player 2: " + this.points2;
                    alert(msg);
                    this.state="menu";
                    menu()
                }
                break;
            case "undo":
                this.scene.setPickEnabled(false);
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
        let numberPickedObjects = this.gameboard.display();
        //still need to work out id numbers and picking objects of the scene
        this.theme.render(numberPickedObjects);
        this.animator.display();
    }
     
    //add reaction to select buttons like undo (call function undo()), movie (call functionn movie()), exit, etc.
    onObjectSelected(obj, id) {
        if(obj instanceof MyTile){
            console.log("I'm a tile on coordinates " + obj.x + " " + obj.y + " " + obj.z);
            obj.selected=true;
            if (this.state == "pick first tile human"){
                this.moveToExecute = [this.currentPlayer, obj.y, obj.x];
                this.state = "pick second tile human";
            }
            else if (this.state == "pick second tile human"){
                this.moveToExecute.push(obj.y, obj.x);
                this.state="render move"
                this.prolog.movePieceRequest(this.moveToExecute, this.gameboard.convertToPrologBoard());
            }
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