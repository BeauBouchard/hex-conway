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
        this.setupButtons();
        game.start();
        //this.grid.initCircle();
    },
    start: function() {
    	console.log("Starting Game");
    	//this.setupLife(this.seedCount);
        this.active = true;
        this.setupLife(500);
    },
    restart: function() {
        this.clear();
        this.setupLife(500);
    },
    clear: function () {
        for (var row = 0; row < this.grid.getMaxRows(); row++) {
            for (var column = 0; column < this.grid.getMaxColumns(); column++) {
                this.destroyLife(row,column);
            }
        }
        this.gameTime = 0;
    },    
    setupLife: function (numLife) {
        console.log("Setting up game with "+numLife+" living Organisms");
        for(var i = 1; i <= numLife; i++){
            this.createLife(getRandomInt(0, this.grid.getMaxRows()),getRandomInt(0, this.grid.getMaxColumns()))
        } 
    },
    setupButtons: function () {
        var step = document.getElementById("step");
        var restart = document.getElementById("restart");
        var clear = document.getElementById("clear");
        var spawn10 = document.getElementById("spawn10");
        var spawn5 = document.getElementById("spawn5");
        var spawn2 = document.getElementById("spawn2");

        step.onclick = function(){ game.update(); };
        restart.onclick = function(){ game.restart(); }
        clear.onclick = function(){ game.clear(); }
        spawn10.onclick = function(){ game.setupLife(1000); }
        spawn5.onclick = function(){ game.setupLife(500); }
        spawn2.onclick = function(){ game.setupLife(200); }
    },
    clicked: function (row,col) {
        this.createLife(row,col);
    },
    update: function () {
        console.log("game.update");
        for (var row = 0; row < this.grid.getMaxRows(); row++) {
            for (var column = 0; column < this.grid.getMaxColumns(); column++) {
                var currentTile = this.grid.getTile(row,column);
                var alive = this.checkAlive(row,column);//check if tile/cell is alive. 
                var living = this.grid.getLivingNeighbors(currentTile);//check the number of living neighbors.
                //apply rules  3,5/2 ~~3,5,6/2~~
                if(alive && living < this.livingFloor){
                    this.destroyLife(row,column); //Dies as if caused by under-population.
                } if(alive && living > this.livingCeil) {
                    this.destroyLife(row,column); //Dies as if by overcrowding.
                }  if(alive && (living == 2)) {
                    //lives on to the next generation.
                } if(alive == false && (living == 3 || living == 5 )) {
                    this.createLife(row,column); //becomes a live cell, as if by reproduction.
                } 
            }
        }
        this.gameTime++;
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
        if(this.grid.tileSet[row][col].getOccupied()){
            return true;
        }
        return false;
    }
}



function CELL(lifeid) {
	this.id = lifeid;
    this.colorchart = ['#DB0148', '#5D9E9A', '#C8DCBF' ];
    this.color = this.colorchart[this.id];
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

