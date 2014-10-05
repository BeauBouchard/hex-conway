/**
 * Game of Life Attempt
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
};


function MAP(mapwidth,mapheight,tilesize) { 
    /**
     * There are 6 neighbors for every tile, the direction input is below:
     *      __
     *   __/  \__
     *  /  \_3/  \
     *  \_2/  \4_/
     *  / 1\__/5 \
     *  \__/0 \__/
     *     \__/
     */
    this.nDelta = {
        even: [ [1,  0], [ 0, -1], [-1, -1],
                [-1,  0], [-1, 1], [ 0, 1] ],
             //[1,  0], [1, -1], [ 0, -1],[-1,  0], [-1, 1], [ 0, 1]
        odd: [ [1,  0], [1, -1], [ 0, -1],
               [-1,  0], [ 0, 1], [1, 1] ]
    }
    this.mapwidth           = mapwidth;
    this.mapheight          = mapheight;
    this.tilesize           = tilesize;
    this.tileWidth          = this.tilesize * 2;
    this.tileHeight         = Math.sqrt(3)/2 * this.tileWidth; 
    this.verticalSpacing    = this.tileHeight;
    this.horizontalSpacing  = 3/4 * this.tileWidth;
    this.maxRows            = Math.floor((this.mapheight / this.verticalSpacing)) - 1;
    this.maxColumns         = Math.floor((this.mapwidth / this.horizontalSpacing)) - 1;
    //console.log(this.height);
    this.tileSet= new Array(this.maxRows);
    var row, column;
    for (row = 0; row < this.maxRows; row++) {
        this.tileSet[row] = new Array(this.maxColumns);
        for (column = 0; column < this.maxColumns; column++) {
            this.tileSet[row][column] = new TILE(this.tilesize, row, column);
        }
    }
}

MAP.prototype = { 
    generate: function () {
        console.log("MAP.generate");
        for(var tileid = 0; tileid<=((this.maxRows)*(this.maxColumns));tileid++){
            var row = tileid%this.maxRows;
            var column = tileid%this.maxColumns;
            //console.log("Row:"+row+" Column:"+column+"");
            this.tileSet[row][column].setid(tileid);
            this.tileSet[row][column].draw();
        }
    },
    initCircle: function () {
        this.tileCount          = 6;
        console.log("MAP.initCircle");
        console.log("generating: " + this.tileCount + " rings of tiles");
        // size is the size of the hex from corner to another corner across. 
        var xCenter     = this.mapwidth / 2;
        var yCenter     = this.mapheight / 2;
        var tileid = 0;
        //console.log("MaxRows:"+this.maxRows+" MaxColumns:"+this.maxColumns+ " "+yCenter );
        for (var q = -this.tileCount; q <= this.tileCount; q++) {
            for (var r = -this.tileCount; r <= this.tileCount; r++) {
                if ((q < 0 && r < 0) || (q > 0 && r > 0)) {
                    if ((Math.abs(q) + Math.abs(r)) > this.tileCount) {
                        continue;
                    }
                }
                //console.log("MAP.newtile");
                var x = this.tilesize * 3/2 * r;
                var y = this.tilesize * Math.sqrt(3) * (q + r/2);

                var row = tileid%this.maxRows;
                var column = tileid%this.maxColumns;
                //console.log("Row:"+row+" Column:"+column+" X:"+(x + xCenter) + " Y:" + (y + yCenter));
                //alert("");
                this.tileSet[row][column].initialize(tileid,x + xCenter, y + yCenter);
                this.tileSet[row][column].draw();
                //this.tileset.push(atile);
                tileid++;
            }
        }
        this.drawMap();
        return;
    },
    getTile: function(row,col) {
        return this.tileSet[row][col];
    },
    getMaxRows: function() {
        return this.maxRows;
    },
    getMaxColumns: function() {
        return this.maxColumns;
    },
    setTile: function(row,col, tile) {
        this.tileSet[row][col] = tile;
    },
    /**
     * There are 6 neighbors for every tile, the direction input is below:
     *      __
     *   __/  \__
     *  /  \_3/  \
     *  \_2/  \4_/
     *  / 1\__/5 \
     *  \__/0 \__/
     *     \__/
     */
    getNeighbor: function(tile,direction) {
        var parity = tile.getColumn() & 1 ? 'odd' : 'even'; //checks if row is even or odd, assigns
        var delta = this.nDelta[parity][direction]; // returns a array, with 0 being row delta, and 1 column delta
        //if(direction == 2){ console.log("parity:"+parity);}

        var newRow = tile.getRow() + delta[0];
        var newCol = tile.getColumn() + delta[1];
        //console.log("Row:" + tile.getRow() + " Col:" +tile.getColumn());
        //console.log(" direction:" + direction +"parity:"+ parity + " delta[0]:" + delta[0] + " delta[1]:" + delta[1] );
        if(newRow < 0 || newCol < 0 || newRow >= this.maxRows || newCol >= this.maxColumns)         {
            //skip
            return false;
        } else {
            return this.tileSet[tile.getRow() + delta[0]][ tile.getColumn() + delta[1]];
        }
        
    },
    getLivingNeighbors: function(tile) {
        var count = 0; //living Neighbor count
        var parity = tile.getColumn() & 1 ? 'odd' : 'even';
        for(var i = 0; i <6; i++){
            var delta = this.nDelta[parity][i];
            //console.log("Delta: "+delta + " Parity:" + parity);
            var newRow = tile.getRow() + delta[0];
            var newCol = tile.getColumn() + delta[1];
            //console.log("newRow: "+newRow + " newCol:" + newCol);
            if(newRow < 0 || newCol < 0 || newRow >= this.maxRows || newCol >= this.maxColumns)         {
                //skip
            } else  {
                var tiletocheck = this.tileSet[newRow][newCol].getOccupied();
                if(tiletocheck){
                    count++;
                }
            }
        
        }
        return count;
    }
}


function TILE(tilesize, row, column) {
    this.cell;
    this.row = row;
    this.column = column;
    this.tag = '';
    this.data = {};
    this.nSides  = 6; // ma sides
    this.size    = tilesize; //size corner to corner
    this.centerX = 0;
    this.centerY = 0;
    this.display = false;
    this.id      = 0;
    this.region;
    this.x = this.size * 3/2 * (1 + column);
    this.y = this.size * Math.sqrt(3) * (1 + row + 0.5 * (column&1));
    this.strokeStyle = "black";
    this.fillStyle = '#323232';
    this.lineWidth = 1;
    this.occupied = false;
}

TILE.prototype = {
    initialize: function(id) {
        this.id = id;
    },
    initialize: function(id,centerX,centerY)  {
        this.id = id;
        this.x = centerX;
        this.y = centerY;
    },
    draw: function() {
        if(this.display === true) {
            //clear tile, then redraw
            this.clear();
        } else {
            var xmlns = "http://www.w3.org/2000/svg";
            var svgspace = document.getElementById("gamesvg");
            var polygon = document.createElementNS(xmlns,'polygon');
                polygon.setAttributeNS(null, 'id', 'polygon'+this.id);
                polygon.setAttributeNS(null, 'row', this.row);
                polygon.setAttributeNS(null, 'column', this.column);
                polygon.setAttributeNS(null, 'stroke-width', this.lineWidth );
                polygon.setAttributeNS(null, 'fill',this.fillStyle);
                polygon.setAttributeNS(null, 'stroke',this.strokeStyle);
                polygon.setAttributeNS(null, 'opacity', 1); 
            
            var pointString = "";
            //draws the element based on how many sides
            for( var i = 0; i <= this.nSides; i++) {
                var angle = 2 * Math.PI / this.nSides * i;
                //Corner x and y, draws each side/cornerpoint
                var cornX = this.x + this.size * Math.cos(angle);
                var cornY = this.y + this.size * Math.sin(angle);
                // if(checkneighbor) {
                if( i == 0) {
                    pointString = " " + cornX + "," + cornY;
                } else {
                    pointString += " " + cornX + "," + cornY;
                }
                // }
            }
            polygon.setAttributeNS(null, 'points', pointString);
            polygon.onclick = function(){ game.clicked(this.getAttribute("row"),this.getAttribute("column")) }
            var gTile = document.createElementNS(xmlns,'g');
                gTile.setAttributeNS(null, 'id','tile' + this.id);
                gTile.appendChild(polygon);
            svgspace.appendChild(gTile);
            this.display = true;

        }
    }, 
    clear: function() {
        if(this.display === true) {
            var svgspace = document.getElementById("gamesvg");
            var polylist = svgspace.querySelectorAll("polygon"+this.id);
            //polylist.getElementById("polygon"+this.id);
            this.display = false;
        }
    },
    reset: function () {
        //set to default starting white tile

        this.strokeStyle = "black";
        this.fillStyle = '#323232';
        this.lineWidth = 1;
        this.occupied = false;
        this.cell = false;
        this.clear();
        this.draw();

    },
    occupy: function (cell) {
        this.setOccupied(true);
        this.cell = cell;
    },
    toString: function() {
        return this.row + ', ' + this.column;
    }
}

TILE.prototype.setid     = function(newid)     { this.id     = newid;};
TILE.prototype.setX      = function(newX)     { this.x     = newX;};
TILE.prototype.setY      = function(newY)     { this.y     = newY;};
TILE.prototype.setFillStyle    = function(newFill)  { this.fillStyle   = newFill;};
TILE.prototype.setStrokeStyle  = function(newStroke){ this.strokeStyle = newStroke;};
TILE.prototype.setLineWidth    = function(newWidth) { this.lineWidth   = newWidth;};
TILE.prototype.setOccupied     = function(newOccupied) {this.occupied = newOccupied; };
TILE.prototype.getid      = function() { return this.id;};
TILE.prototype.getX      = function() { return this.x;};
TILE.prototype.getY      = function() { return this.y;};
TILE.prototype.getColumn      = function() { return this.column;};
TILE.prototype.getRow      = function() { return this.row;};
TILE.prototype.getfillStyle    = function() { return this.fillStyle;};
TILE.prototype.getstrokeStyle  = function() { return this.strokeStyle;};
TILE.prototype.getlineWidth    = function() { return this.lineWidth;};
TILE.prototype.getOccupied     = function() { return this.occupied; }
