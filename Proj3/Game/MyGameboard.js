/**
 * MyGameboard
 */
class MyGameboard extends CGFobject {
	constructor(scene, prologBoard) {
        super(scene);

        //tiles creation
        this.tiles=[];
        for (let line=-7; line<=7; line++){
            for (let column=-(14 - Math.abs(line)); column<=(14 - Math.abs(line)); column+=2){
                let material='grey';
                if ((Math.abs(line)==7 && Math.abs(column)==7)|| (line==0 && Math.abs(column)==14))
                    material="red";
                else if((line*column>0 && ((Math.abs(line)==1 && Math.abs(column)==13) || (Math.abs(line)==7 && Math.abs(column)==5)) || (line*column<0 && Math.abs(line)==6 && Math.abs(column)==8)))
                    material="orange";
                else if((Math.abs(line)==1 && Math.abs(column)==13) || (Math.abs(line)==7 && Math.abs(column)==5) || (Math.abs(line)==6 && Math.abs(column)==8))
                    material="violet";
                else if((line*column>0 && ((Math.abs(line)==2 && Math.abs(column)==12) || (Math.abs(line)==7 && Math.abs(column)==3)) || (line*column<0 && Math.abs(line)==5 && Math.abs(column)==9)))
                    material="yellow";
                else if((Math.abs(line)==2 && Math.abs(column)==12) || (Math.abs(line)==7 && Math.abs(column)==3) || (Math.abs(line)==5 && Math.abs(column)==9))
                    material="darkBlue";
                else if((line*column>0 && ((Math.abs(line)==3 && Math.abs(column)==11) || (Math.abs(line)==7 && Math.abs(column)==1)) || (line*column<0 && Math.abs(line)==4 && Math.abs(column)==10)))
                    material="green";
                else if((Math.abs(line)==3 && Math.abs(column)==11) || (Math.abs(line)==7 && Math.abs(column)==1) || (Math.abs(line)==4 && Math.abs(column)==10))
                    material="blue";
                this.tiles.push(new MyTile(scene, "tile", material, column, line, 0, false));
            }
        }

        //auxiliaryTiles creation -> tiles that are not par of the boardGame, are just for holding pieces that are yet not on the board
        this.auxiliaryTilesPlayer1=[];
        this.auxiliaryTilesPlayer2=[];
        for (let i=0; i<17; i++){
            for (let j=0; j<10; j++){
                this.auxiliaryTilesPlayer1.push(new MyTile(scene, 'tile', 'grey', 20, i-8.5, j, true));
                this.auxiliaryTilesPlayer2.push(new MyTile(scene, 'tile', 'grey', -20, i-8.5, j, true));
            }
        }

        //pieces creation - 169 pieces fit in the board -> 170 pieces per player
        this.pieces=[];
        for (let i=0; i<170; i++){
            let piece1 = new MyPiece(scene, 1, 'piece', 'black');
            this.pieces.push(piece1);
            this.auxiliaryTilesPlayer1[i].setPiece(piece1);
            piece1.setHoldingTile(this.auxiliaryTilesPlayer1[i]);

            let piece2=new MyPiece(scene, 2, 'piece', 'white');
            this.pieces.push(piece2);;
            this.auxiliaryTilesPlayer2[i].setPiece(piece2);
            piece2.setHoldingTile(this.auxiliaryTilesPlayer2[i]);
        }

        //putting the pieces in the right place according to the prologBoard
        if (prologBoard==undefined)
            return;
        for (let i =0; i<prologBoard.length; i++){
            let line=prologBoard[i][0];
            for (let j=1; j<prologBoard[i].length; j++){
                let column=prologBoard[i][j][0];
                let value = prologBoard[i][j][1];
                if (value == 1){
                    let piece = getFirtsPieceFreeToMove(1);
                    this.movePiece(piece, line, column)
                }
                if (value == 2){
                    let piece = getFirtsPieceFreeToMove(1);
                    this.movePiece(piece, line, column)
                }
            }
        }
    }
    
    getFirstTileWithPiece(auxiliaryTiles){
        for (let i=0; i<auxiliaryTiles.length; i++){
            if (this.getPieceOnTile(auxiliaryTiles[i]) != null)
                return auxiliaryTiles[i];
        }
    }

    getFirtsPieceFreeToMove(player){
        if (player == 1)
            return this.getPieceOnTile(getFirstTileWithPiece(this.auxiliaryTilesPlayer1));
        else
            return this.getPieceOnTile(getFirstTileWithPiece(this.auxiliaryTilesPlayer2));
    }

    addPieceToTile(piece, tile){
        tile.setPiece(piece);
        piece.setHoldingTile(tile);
    }

    removePieceFromTile(tile){
        tile.unsetPiece();
    }

    getPieceOnTile(tile){
        return tile.getPiece();
    }

    getTileHoldingPiece(piece){
        return piece.getHoldingTile();
    }

    getTileByCoordinates(x, y){
        for (let i=0; i<this.tiles.length; i++){
            if ((this.tiles[i].x == x) && (this.tiles[i].y == y))
                return this.tiles[i];
        }
    }

    movePiece(piece, x, y){
        destinationTile = this.getTileByCoordinates(x, y);
        fromTile = this.getTileHoldingPiece(piece);
        this.removePieceFromTile(fromTile);
        this.addPieceToTile(piece, destinationTile);
    }

    convertToPrologBoard(){
        let board=[];
        for (let line=-7; line<=7; line++){
            let line_array=[line];
            for (let column=-(14 - Math.abs(line)); column<=(14 - Math.abs(line)); column+=2){
                let cell_array=[column];
                let tile = this.getTileByCoordinates(column, line);
                let piece = this.getPieceOnTile(tile);
                if (piece == null)
                    cell_array.push(0);
                else if (piece.getPlayer()==1)
                    cell_array.push(1);
                else
                    cell_array.push(2);
                line_array.push(cell_array);
            }
            board.push(line_array);
        }
        return board;
    }

    display(){
        let numberRegistered=1;
        for(let i=0; i<this.tiles.length; i++){
            if (this.tiles[i].selectable){
                this.scene.registerForPick(numberRegistered + 1, this.tiles[i]);
                this.tiles[i].display();
                this.scene.clearPickRegistration();
                numberRegistered++;
            }
        }
        for(let i=0; i<this.pieces.length; i++)
            this.pieces[i].display();
        return numberRegistered;
    }
}