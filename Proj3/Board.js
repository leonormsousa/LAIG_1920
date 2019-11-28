/**
 * Board
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Board extends CGFobject {
	constructor(scene) {
        super(scene);
    }
    
    display(){
        for (let line=-7; line<=7; line++){
            for (let column=-(14 - Math.abs(line)); column<=(14 - Math.abs(line)); column+=2){
                let material='grey';
                let texture="grey";
                this.scene.pushMatrix();
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
                this.scene.translate(column*Math.sqrt(3)/2, 0, line*1.5);
                this.scene.graph.processNode('board_cell', mat4.create(), material, texture, 1, 1)
                this.scene.popMatrix();
            }
        }
    }
}
