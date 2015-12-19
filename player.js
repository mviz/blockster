"use strict";

Object.defineProperty(Multiplier, "MULTIPLIER_TIMEOUT_IN_SECONDS", {value: 4});
Object.defineProperty(Player, "MAX_VELOCITY", {value : 0.7});
var GRAVITY = 0.0001; //TODO: refactor to world

function Player() {
    this.height = 16;
    this.width = 16;
    this.x = 50;
    this.y = 0;
    this.vy = 0;
    this.hasJump = false;
    this.hasBoost = true;
    this.multiplier = new Multiplier();
    this.score = 0;
}

Player.prototype.tick = function(timePassed) {
	this.applyPhysics(timePassed);
    this.updateScore(timePassed);
};

Player.prototype.applyPhysics = function(timePassed) {
    if(this.vy < Player.MAX_VELOCITY){
        this.vy += GRAVITY * timePassed;
    }
    
    this.y += this.vy * timePassed;
};

Player.prototype.updateScore = function(timePassed) {
    this.multiplier.tick(timePassed);
    this.score += this.multiplier.value * timePassed;
};

Player.prototype.collideBlocks = function(blocks) {
    this.topCollision(blocks);
    this.bottomCollision(blocks);
};

Player.prototype.topCollision = function(blocks){
    this.hasJump = false;
    for(var i = 0; i < blocks.length; i++){
        var block = blocks[i];

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
};

Player.prototype.bottomCollision = function(blocks) {
    //TODO: this function is very similar to topCollision, maybe we can generalize it. 
    for(var i = 0; i < blocks.length; i++){
        var block = blocks[i];
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
};


/*  
    |       /\
    |       \/

    as an approximation, we just need to check if one of the three points (top, middle, bottom) 
    lies inside the multiplier
*/

Player.prototype.collideMultipliers = function(multipliers) {

    var collidedWith = [];
    var playerPoints = [{x : this.x + this.width, y : this.y},                  //top right
                         {x : this.x + this.width, y : this.y + this.height/2},//middle right
                         {x : this.x + this.width, y : this.y + this.height},  //bottom right
                         {x : this.x,              y : this.y + this.height},                 //bottom left
                         {x : this.x,              y : this.y}];                                //top left
                         // no need for middle left because that cant collide due to moving right

    for(var i = 0; i < multipliers.length; i++) {

        var multiplier = multipliers[i];

        for(var j = 0; j <  playerPoints.length; j++) {
            if(Utils.contains(playerPoints[j], multiplier.getCorners())) {
                collidedWith.push(multiplier);
                break;
            }
        }
    }

    return collidedWith;
};


Player.prototype.isDead = function (world) {
	return this.y > world.height + 5;
};

Player.prototype.jump = function (event) {
	if(event !== undefined) {
		event.preventDefault();
	}

	if(this.hasJump){
    	this.vy = -0.1;
    } else if (this.hasBoost){
    	this.vy = -0.07;
    	this.hasBoost = false;
    }
};


function Multiplier() {
    this.value = 1;
    this.timeLeft = 0;
}


Multiplier.prototype.getTimeLeft = function() {
	return this.timeLeft;
};

Multiplier.prototype.getTotalTime = function () {
	return (2/(0.5 * this.value)) * Multiplier.MULTIPLIER_TIMEOUT_IN_SECONDS * 60; //TODO: magic number(frame rate to reduce dependency)
};

Multiplier.prototype.tick = function(timePassed) {    
    if(this.value > 1 && this.timeLeft <= 0){
        this.value--;
        this.timeLeft = this.getTotalTime();
    }

    this.timeLeft -= timePassed;
};

Multiplier.prototype.add = function() {
    this.value++;
    this.timeLeft = this.getTotalTime();
};