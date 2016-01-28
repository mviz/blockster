/* jshint browser: true */
/* jshint -W097 */
/* global Utils */

"use strict";

var GRAVITY_IN_MILLISECONDS = 0.0005;

/*
    Our maximum fall speed is approximately worldheight / expected fall time (2 seconds at max speed is super slow but reaasonable) / 1000 because of seconds not milliseconds
    (320/2/1000)
*/

Object.defineProperty(Multiplier, "MULTIPLIER_TIMEOUT_IN_MILLISECONDS", {value: 4000});
Object.defineProperty(Player, "MAX_VELOCITY", {value : 0.3});
Object.defineProperty(Player, "JUMP_ACCEL_IN_MILLISECONDS", {value : -GRAVITY_IN_MILLISECONDS});
Object.defineProperty(Player, "JUMP_LENGTH_IN_MILLISECONDS", {value : 400});


function Player() {
    this.height = 16;
    this.width = 16;
    this.x = 50;
    this.y = 0;

    this.vy = 0;

    this.touchingBlock = undefined;
    this.jumpAccelTimeLeft = 0;
    this.hasJump = false;
    this.hasBoost = true;
    this.multiplier = new Multiplier();
    this.score = 0;
}

Player.prototype.tick = function(deltaTime, blocks) {
    this.collideBlocks(blocks);
  	this.applyPhysics(deltaTime);
    this.updateScore(deltaTime);
};

Player.prototype.applyPhysics = function(deltaTime) {

    //Apply acceleration, update velocity.
    if(this.jumpAccelTimeLeft > 0) {
        var accelAmount = Math.min(deltaTime, this.jumpAccelTimeLeft);
        this.vy += Player.JUMP_ACCEL_IN_MILLISECONDS * accelAmount;
        this.jumpAccelTimeLeft -= deltaTime;
    } else if(this.touchingBlock){
        this.vy = 0;
    } else if(this.vy < Player.MAX_VELOCITY) {
        this.vy = Math.min(this.vy + GRAVITY_IN_MILLISECONDS * deltaTime, Player.MAX_VELOCITY);
    }

    //Apply velocity, update position.
    if(this.touchingBlock && this.vy >= 0) {
        this.y = this.touchingBlock.y - this.height;
    } else {
        this.y += this.vy * deltaTime;
    }
};

Player.prototype.updateScore = function(deltaTime) {
    this.multiplier.tick(deltaTime);
    this.score += this.multiplier.value * deltaTime;
};

Player.prototype.collideBlocks = function(blocks) {
    this.touchingBlock = undefined;

    for(var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if(block.isOverlapping(this)) {
            if(this.vy < 0) {
                this.vy = 0;
                this.y = block.y + block.height + 2;
            } else {
                this.touchingBlock = block;
                this.hasJump = true;
                this.hasBoost = true;
            }

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
    	this.jumpAccelTimeLeft = Player.JUMP_LENGTH_IN_MILLISECONDS;
        this.hasJump = false;
    } else if (this.hasBoost){
        this.jumpAccelTimeLeft = Player.JUMP_LENGTH_IN_MILLISECONDS * 0.8;
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
	return (2/(0.5 * this.value)) * Multiplier.MULTIPLIER_TIMEOUT_IN_MILLISECONDS;
};

//TODO: this is a "post update" meaning we update things after they happen..
Multiplier.prototype.tick = function(deltaTime) {
    if(this.value > 1 && this.timeLeft <= 0){
        this.value--;
        this.timeLeft = this.getTotalTime();
    }

    this.timeLeft -= deltaTime;
};

Multiplier.prototype.add = function() {
    this.value++;
    this.timeLeft = this.getTotalTime();
};
