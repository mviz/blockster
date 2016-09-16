/* jshint browser: true */
/* jshint -W097 */
/* global Utils */

"use strict";

/*
    Our maximum fall speed is approximately worldheight / expected fall time (2 seconds at max speed is super slow but reaasonable) / 1000 because of seconds not milliseconds
    (320/2/1000)
*/

Object.defineProperty(Multiplier, "MULTIPLIER_TIMEOUT_IN_MILLISECONDS", {value: 4000});
Object.defineProperty(Player, "MAX_VELOCITY", {value : 0.3});
Object.defineProperty(Player, "GRAVITY_PER_MILLISECOND", {value : 0.0005});
Object.defineProperty(Player, "JUMP_ACCEL_PER_MILLISECOND", {value : -Player.GRAVITY_PER_MILLISECOND});
Object.defineProperty(Player, "JUMP_LENGTH_IN_MILLISECONDS", {value : 400});


function Player() {
    this.height = 16;
    this.width = 16;
    this.x = 50;
    this.y = 0;

    this.vy = 0;

    this.touchingBlock = undefined;
    this.jumpAccelTimeLeft = 0;
    this.hasBoost = true;
    this.multiplier = new Multiplier();
    this.score = 0;
}

//TODO: vx isn't actually constant.. it shoule probably be accounted for.
Player.simulateJump = function (t, y0, vy0, a, g, vmax, boostLength) {
    if(t <= boostLength) {
		return y0 + vy0 * t + 0.5 * a * t * t;
	} else {
		return Player.simulateFall(t - boostLength,
			Player.simulateJump(boostLength, y0, vy0, a, g, vmax, boostLength), boostLength * a + vy0, g, vmax);
	}
};

//TODO: use net accel rather than just straight up.
Player.simulateFall = function (t, y0, vy0, g, vmax) {
	var vmaxat = (vmax - vy0) / g;

	if(t <= vmaxat) {
		return y0 + t * vy0 + 0.5 * g * t * t;
	} else {
		return vmax * (t - vmaxat) + Player.simulateFall(vmaxat, y0, vy0, g, vmax);
	}
};

Player.simulateJumpAndBoost = function (t, y0, vy0, a, g, vmax, boostLength) {
	if(t <= boostLength) {
		return Player.simulateJump(t, y0, vy0, a, g, vmax, boostLength);
	} else {
		return Player.simulateJump(t - boostLength, Player.simulateJump(boostLength, y0, vy0, a, g, vmax, boostLength), a * boostLength + vy0, a, g, vmax, boostLength);
	}
};

Player.prototype.tick = function(deltaTime, blocks) {
  	this.applyPhysics(deltaTime);
    this.updateScore(deltaTime);
};

Player.prototype.applyPhysics = function(deltaTime) {

    //Apply acceleration, update velocity.
    if(this.jumpAccelTimeLeft > 0) {
        var accelAmount = Math.min(deltaTime, this.jumpAccelTimeLeft);
        this.vy += Player.JUMP_ACCEL_PER_MILLISECOND * accelAmount;
        this.jumpAccelTimeLeft -= deltaTime;
    } else if(this.touchingBlock){
        this.vy = 0;
    } else if(this.vy < Player.MAX_VELOCITY) {
        this.vy = Math.min(this.vy + Player.GRAVITY_PER_MILLISECOND * deltaTime, Player.MAX_VELOCITY);
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

/*
    |       /\
    |       \/

    as an approximation, we just need to check if one of the three points (top, middle, bottom)
    lies inside the multiplier
*/

//TODO: move this to the block collision.

Player.prototype.getPoints = function () {
    return [{x : this.x + this.width, y : this.y},                  //top right
            {x : this.x + this.width, y : this.y + this.height/2},//middle right
            {x : this.x + this.width, y : this.y + this.height},  //bottom right
            {x : this.x,              y : this.y + this.height},                 //bottom left
            {x : this.x,              y : this.y}];
};

Player.prototype.isDead = function (world) {
	return this.y > world.height + 5;
};

Player.prototype.jump = function (event) {
	if(event !== undefined) {
		event.preventDefault();
	}

	if(this.touchingBlock){
    	this.jumpAccelTimeLeft = Player.JUMP_LENGTH_IN_MILLISECONDS;
    } else if (this.hasBoost){
        this.jumpAccelTimeLeft = Player.JUMP_LENGTH_IN_MILLISECONDS;
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
