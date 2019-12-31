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
        this.prolog.sendPrologRequest(['quit'], this.prolog.handleReply);
        //wait for eventListener to end work
        let response = this.prolog.response;
        console.log('!!!' + response + '!!!');
        
        this.state = "menu";
        this.pickingEnabled=false;
        this.currentPlayer=1;
        this.level=1;
        this.number_passes=0;
        // index 0 for player1 and index 1 for player 2. false is human, true is pc
        this.player=[false, false];
    }

    update(time) {
        this.animator.update(time);
    }

    orchestrate(){
        switch(this.state){
            case "menu":
                this.pickingEnabled=true;

                break;
            case "loading":
                this.pickingEnabled=false;

                break;
            case "pick first tile human":
                this.pickingEnabled=true;
                //picking tile and having button for move with no tiles
                //let tile = 
                this.moveToExecute= [this.currentPlayer, tile.x, tile.y];
                this.state="pick second tile human";
                break;
            case "pick second tile human":
                this.pickingEnabled=true;
                //picking and having button for move with only one tile
                if (tile==null)
                    this.moveToExecute.push([], []);
                else
                    this.moveToExecute.push(tile.x, tile.y);
                this.state="render move human"
                break;
            case "pick tiles pc":
                this.pickingEnabled=false;
                this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
                //wait for eventListener to end work
                this.moveToExecute = this.prolog.response;
                this.state="render move pc";
                sleep(3);
                break;
            case "render move":
                this.pickingEnabled=false;
                this.prolog.movePieceRequest(this.moveToExecute);
                //wait for eventListener to end work
                moveReply =  this.prolog.response;
                if (moveReply == null){
                    alert("Move Not Possible!");
                    this.state="pick first tile human";
                    break;
                }
                if(this.moveToExecute[1]=[]){
                    this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], null, null, null, null, null, null, this.gameboard));
                    this.number_passes++;
                }
                else{
                    this.number_passes=0;
                    let pieceToMove1=this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
                    let originTile1 = this.gameboard.getTileHoldingPiece(pieceToMove1);
                    let destinationTile1 = this.gameboard.getTileByCoordinates(this.moveToExecute[1], this.moveToExecute[2]);
                    this.gameboard.movePiece(pieceToMove1, this.moveToExecute[1], this.moveToExecute[2]);
                    if (this.moveToExecute[3] = [])
                        this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, null, null, null, this.gameboard));
                    else{
                        let pieceToMove2 = this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
                        let originTile2 = this.gameboard.getTileHoldingPiece(pieceToMove2);
                        let destinationTile2 = this.gameboard.getTileByCoordinates(this.moveToExecute[3], this.moveToExecute[4]);
                        this.gameboard.movePiece(pieceToMove2, this.moveToExecute[3], this.moveToExecute[4]);
                        this.gameSequence.addGameMove(new MyGameMove(this.scene, this.moveToExecute[0], pieceToMove1, originTile1, destinationTile1, pieceToMove2, originTile2, destinationTile2, this.gameboard));
                    }
                }
                this.currentPlayer = (this.currentPlayer % 2) + 1;
                this.state = "animation";
                break;
            case "animation":
                this.pickingEnabled=false;
                //dont understant how its going to work
                this.state = "game end evaluation";
                break;
            case "game end evaluation":
                this.pickingEnabled=false;
                this.prolog.gameOverRequest(this.gameboard.convertToPrologBoard()) || this.number_passes>=2;
                //wait for eventListener to end work
                let resp = this.prolog.response;
                if (resp)
                    this.state="end game";
                else if (this.player[this.currentPlayer-1])
                    this.state="pick tiles pc";
                else
                    this.state="pick first tile human";   
                break;
            case "end game":
                this.prolog.calculatePointsRequest(this.gameboard.convertToPrologBoard(), 1);
                //wait for eventListener to end work
                let points1 = this.prolog.response;
                this.prolog.calculatePointsRequest(this.gameboard.convertToPrologBoard(), 2);
                //wait for eventListener to end work
                let points2 = this.prolog.response;
                this.prolog.calculateWinnerRequest(points1, points2);
                //wait for eventListener to end work
                let winner = this.prolog.response;
                let msg;
                if (winner == null)
                    msg="It's a Tie";
                else
                    msg = "The winner is Player " + winner;
                msg += "!\n" + "Group points by Player 1: " + points1 + "\nGroup points by Player 2: " + points2;
                alert(msg);
                this.state="menu";
                break;
            case "undo":
                this.pickingEnabled=false;
                this.gameboard = this.gameSequence.undoGameMove();
                this.currentPlayer = (this.currentPlayer % 2) + 1;
                if (this.number_passes>0)
                    this.number_passes--;
                //wait for animation to end yey;
                if (this.player[this.currentPlayer-1])
                    this.state="pick tiles pc";
                else
                    this.state="pick first tile human"; 
                break;
            case "movie":
                this.pickingEnabled=false;

                break;
        }
    }

    display() {
    //...
    this.theme.display();
    this.gameboard.display();
    this.animator.display();
    //...
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if (results != null && results.length > 0) { // any results?
                for (var i=0; i< results.length; i++) {
                    var obj = pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }
     
    onObjectSelected(obj, id) {
        if(obj instanceof MyTile){
            // do something with id knowing it is a tile
        }
        else {
            // error ?
        }
    }
               
}

const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}