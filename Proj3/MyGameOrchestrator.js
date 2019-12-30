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
        
        this.state = "menu";
        this.pickingEnabled=false;
        this.currentPlayer=1;
        this.level=1;
    }

    update(time) {
        this.animator.update(time);
    }

    orchestrate(){
        switch(this.state){
            case "menu":

                break;
            case "loading":
                this.pickingEnabled=false;
                break;
            case "pick first tile human":
                this.pickingEnabled=true;
                //picking tile
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
                this.moveToExecute=this.prolog.chooseMoveRequest(this.gameboard.convertToPrologBoard(), this.level, this.currentPlayer);
                this.state="render move pc";
                sleep(3);
                break;
            case "render move":
                this.pickingEnabled=false;
                moveReply = this.prolog.movePieceRequest(this.moveToExecute);
                if (moveReply == null){
                    //show warning saying the move it's not possible
                    this.state="pick first tile human";
                    break;
                }
                let pieceToMove1=this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
                let originTile1 = this.gameboard.getTileHoldingPiece(pieceToMove1);
                let destinationTile1 = this.gameboard.getTileByCoordinates(this.moveToExecute[1], this.moveToExecute[2]);
                if (this.moveToExecute[3] = [])
                    this.gameSequence.addGameMove(new MyGameMove(this.scene, pieceToMove1, originTile1, destinationTile1, null, null, null, this.gameboard));
                else{
                    let pieceToMove2 = this.gameboard.getFirtsPieceFreeToMove(this.moveToExecute[0]);
                    let originTile2 = this.gameboard.getTileHoldingPiece(pieceToMove2);
                    let destinationTile2 = this.gameboard.getTileByCoordinates(this.moveToExecute[3], this.moveToExecute[4]);
                    this.gameSequence.addGameMove(new MyGameMove(this.scene, pieceToMove1, originTile1, destinationTile1, pieceToMove2, originTile2, destinationTile2, this.gameboard));
                }
                this.currentPlayer = (this.currentPlayer % 2) + 1;
                this.state = "animation";
                break;
            case "animation":
                //dont understant how its going to work
                break;
            case "game end evaluation":

                break;
            case "end game":

                break;
            case "undo":

                break;
            case "movie":

                break;
            case "undo":

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
        if(obj instanceof MyPiece){
            // do something with id knowing it is a piece
        }
        else if(obj instanceof MyTile){
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