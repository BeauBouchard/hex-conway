/* 
 *  game.js
 *  Houses game logic for life
 */
function GAME() {
    this.grid;
	this.gamestate   = 0; 
	this.organisms   = [];
    this.gridheight  = 600;
    this.gridwidth   = 600;
    this.seedCount   = 20; // initial number of seeds that will be dropped
    this.tilesize    = Math.sqrt((this.gridwidth^2)+(this.gridheight^2))/(this.seedCount/5);
    this.gameTime    = 0;
    this.gameSpeed   = 1000;
    this.active      = false;
    this.livingFloor        = 2;
    this.livingCeil         = 4;
}

GAME.prototype = {
    initialize: function() {
    	console.log("Initializing Game");
    	this.grid = new MAP(this.gridwidth,this.gridheight,this.tilesize,this.seedCount);
    	this.grid.generate();

        game.start();
        //this.grid.initCircle();
    },
    start: function() {
    	console.log("Starting Game");
    	//this.setupLife(this.seedCount);
        this.active = true;
        this.setupLife(500);
        this.loop();
    },
    restart: function() {

    },
    changeTile: function (numRow, numCol){
        //this.grid.tileset[numRow][numCol].setFillStyle("blue");
        this.grid.tileset[numRow][numCol].clear();
    },
    setupLife: function (numLife) {
        console.log("Setting up game with "+numLife+" living Organisms");
        for(var i = 1; i <= numLife; i++){
            this.createLife(getRandomInt(0, this.grid.getMaxRows()),getRandomInt(0, this.grid.getMaxColumns()))
        } 
    },
    clicked: function (row,col) {
        this.update();
    },
    update: function () {
        console.log("game.update");
        for (var row = 0; row < this.grid.getMaxRows(); row++) {
            for (var column = 0; column < this.grid.getMaxColumns(); column++) {
                //console.log("game.update loop");
                //check if tile/cell is alive. 
                var currentTile = this.grid.getTile(row,column);
                var alive = this.checkAlive(row,column);
                //check the number of living neighbors.
                var living = this.grid.getLivingNeighbors(currentTile);
                //apply rules  3,5/2 and 3,5,6/2 

                if(alive && living < this.livingFloor){
                    // result = false; //Dies as if caused by under-population.
                   //console.log("Rule1");
                    this.destroyLife(row,column);
                } if(alive && living > this.livingCeil) {
                    // result = false; //Dies as if by overcrowding.
                    this.destroyLife(row,column);
                    //console.log("Rule2");
                }  if(alive && (living == 2)) {
                    // result = true; //lives on to the next generation.
                    //console.log("Rule3");
                } if(alive == false && (living == 3 || living == 5 )) {
                    this.createLife(row,column);
                    // result = true;  //becomes a live cell, as if by reproduction.
                    //console.log("Rule4");
                } 
            }
        }
        this.gameTime++;
        //sleep(game.gameSpeed, this.loop);
    },
    createLife: function (row,col) {
        if(this.checkAlive(row,col)){
            //already filled with life
        } else {
            var tile = this.grid.getTile(row,col);
            var od = tile.getid(); 
            var organism = new CELL(getRandomInt(0, 3));
            var neTile = organism.initialize(row,col,tile);
            this.grid.setTile(row,col,neTile);
        }

    },
    destroyLife: function (row,col) {
        var tile = this.grid.getTile(row,col);
        tile.reset();
        this.grid.setTile(row,col,tile);
    },
    checkAlive: function (row,col) {
        //variable
        //console.log("GAME.checkAlive");
        //var cell = new CELL(0);
        if(this.grid.tileSet[row][col].getOccupied()){
            return true;
        }
        return false;
    }, 
    loop: function() {
        //sleep(game.gameSpeed, this.update);

    }
}



function CELL(lifeid) {
	this.id = lifeid;
    this.colorchart = ['#FF4475', '#44FF05', '#4444FF'];
    this.color = this.colorchart[this.id];
    //console.log("Organism created, type " + this.id + ", color is "+this.color );
    this.x;
    this.y;
    this.alive = false;
}

CELL.prototype = {
    initialize: function(y,x,tile) {
        this.x = x;
        this.y = y;
        this.alive = true;
        tile.setFillStyle(this.color);
        return this.redraw(tile);
    },
    getColor: function() {
    	return this.color;
    },
    giveBirth: function() {
        //callback.createLife(this.id);
    },
    move: function() {
        //a toroidal array to wrap left to right, up to down
    },
    redraw: function (tile){
        var netile = tile;
        netile.clear();
        netile.draw();
        netile.occupy(this);
        return netile;
    },
    check: function (row,col){  
    }
}

