var MULTIPLIER_TIMEOUT_IN_SECONDS = 4; //in seconds
var GRAVITY = +0.01; //TODO: refactor to world and fix Player <-> World dependencies. 
var MAX_VEL = 3; 


//TODO: refactor an input class or something. (GameController maybe? Has knowledge of the world and player)
function key_down_handler(event) {
    if (event.keyCode == SPACE_BAR) {
        if (playing) {
            event.preventDefault();
            player.jump();
        } else {
            play_again();
        }
    }
}

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

    this.updateScore(frame);
}


Player.prototype.applyPhysics = function() {
    if(this.vy < 1){
        this.vy += GRAVITY;
    }
    this.y += this.vy
}

Player.prototype.updateScore = function(frame) {
    this.multiplier.update(frame);
    this.score += this.multiplier.value;
}


Player.prototype.topCollision = function(blocks){

    player.hasJump = false;
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

                player.multiplier.add(world.frame);


                world.multipliers.splice(i, 1);//TODO: this seems weird, it's in the wrong spot now
                i--;
    
                break;
            }
        }
    }
}


Player.prototype.isDead = function () {
	return this.y > game_height + 5; //TODO: refactor me please. 
}

Player.prototype.jump = function (event) {
	if(event !== undefined) {
		event.preventDefault();
	}

	if(world.player.hasJump){
    	world.player.vy = -1;
    } else if (world.player.hasBoost){
    	world.player.vy = -0.7;
    	world.player.hasBoost = false;
    }
}


function Multiplier() {
    this.value = 1;
    this.lastPickup = 0;
}


Multiplier.prototype.getTimeLeft = function(frame) {
	var timeElapsed = frame - this.lastPickup;

	return this.getTotalTime() - timeElapsed;
}

Multiplier.prototype.getTotalTime = function () {
	return (2/(0.5 * this.value)) * MULTIPLIER_TIMEOUT_IN_SECONDS * FRAME_RATE;
}

Multiplier.prototype.update = function(frame) {
    //TODO: make this a tick-style function so we don't need frame

    if(this.value > 1 && this.getTimeLeft(frame) <= 0){
        this.value--;
        this.lastPickup = frame;
    }
}

Multiplier.prototype.add = function(frame) {
    this.value++;
    this.lastPickup = frame;
}



