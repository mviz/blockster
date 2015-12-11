Object.defineProperty(Multiplier, "MULTIPLIER_TIMEOUT_IN_SECONDS", {value: 4});

var GRAVITY = +0.01; //TODO: refactor to world and fix Player <-> World dependencies. 

function Player() {
    this.height = 16;
    this.width = 16;
    this.x = 50;
    this.y = 0;
    this.vy = 1;
    this.hasJump = false;
    this.hasBoost = true;
    this.multiplier = new Multiplier();
    this.score = 0;
}

Player.prototype.tick = function(world) {
	this.applyPhysics();

    this.topCollision(world.blocks);
    this.bottomCollision(world.blocks);
    this.multiplierCollision(world);

    this.updateScore();
}


Player.prototype.applyPhysics = function() {
    if(this.vy < 1){
        this.vy += GRAVITY;
    }
    this.y += this.vy
}

Player.prototype.updateScore = function() {
    this.multiplier.tick();
    this.score += this.multiplier.value;
}


Player.prototype.topCollision = function(blocks){

    this.hasJump = false;
    for(var i = 0; i < blocks.length; i++){
        block = blocks[i];
        if (this.y + this.height > block.y &&
            this.y + this.height <= block.y + block.height &&
            this.x + this.width > block.x  &&
            this.x <= block.x + block.width
            ){

            this.y = block.y - this.height;
            this.hasJump = true;
            this.hasBoost = true;
            break;
        }
    }
}

Player.prototype.bottomCollision = function(blocks) {
    //TODO: this function is very similar to topCollision, maybe we can generalize it. 
    for(var i = 0; i < blocks.length; i++){
        block = blocks[i];
        if (this.y > block.y &&
            this.y <= block.y + block.height &&
            this.x + this.width > block.x  &&
            this.x <= block.x + block.width
            ){
            
            this.vy = 0;
            this.y = block.y + block.height + 2;
            break;
        }
    }
}


/*  
    |       /\
    |       \/

    as an approximation, we just need to check if one of the three points (top, middle, bottom) 
    lies inside the multiplier
*/

Player.prototype.multiplierCollision = function(world) {
    var player = world.player;
    var player_points = [{'x' : player.x + player.width, 'y' : player.y},                  //top right
                         {'x' : player.x + player.width, 'y' : player.y + player.height/2},//middle right
                         {'x' : player.x + player.width, 'y' : player.y + player.height},  //bottom right
                         {'x' : player.x, 'y' : player.y + player.height},                 //bottom left
                         {'x' : player.x, 'y' : player.y}];                                //top left
                         // no need for middle left because that cant collide due to moving right

    for(var i = 0; i < world.multipliers.length; i++) {

        var multiplier = world.multipliers[i];

        var multiplier_points = [{'x' : multiplier.x,                      'y' : multiplier.y + multiplier.height/2}, //left
                                 {'x' : multiplier.x + multiplier.width/2, 'y' : multiplier.y + multiplier.height},   //bottom
                                 {'x' : multiplier.x + multiplier.width,   'y' : multiplier.y + multiplier.height/2}, //right
                                 {'x' : multiplier.x + multiplier.width/2, 'y' : multiplier.y}                      //top
                                ];

        for(var j = 0; j <  player_points.length; j++) {
            if(Utils.contains(player_points[j], multiplier_points)) {

                player.multiplier.add();


                world.multipliers.splice(i, 1);//TODO: this seems weird, it's in the wrong spot now
                i--;
    
                break;
            }
        }
    }
}


Player.prototype.isDead = function (world) {
	return this.y > world.height + 5;
}

Player.prototype.jump = function (event) {
	if(event !== undefined) {
		event.preventDefault();
	}

	if(this.hasJump){
    	this.vy = -1;
    } else if (this.hasBoost){
    	this.vy = -0.7;
    	this.hasBoost = false;
    }
}


function Multiplier() {
    this.value = 1;
    this.timeLeft = 0;
}


Multiplier.prototype.getTimeLeft = function() {
	return this.timeLeft;
}

Multiplier.prototype.getTotalTime = function () {
	return (2/(0.5 * this.value)) * Multiplier.MULTIPLIER_TIMEOUT_IN_SECONDS * 60; //TODO: magic number(frame rate to reduce dependency)
}

Multiplier.prototype.tick = function() {
    this.timeLeft--;
    
    if(this.value > 1 && this.timeLeft <= 0){
        this.value--;
        this.timeLeft = this.getTotalTime();
    }
}

Multiplier.prototype.add = function() {
    this.value++;
    this.timeLeft = this.getTotalTime();
}
