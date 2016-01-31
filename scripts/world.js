/* jshint browser: true */
/* jshint -W097 */
/* global Utils */
/* global Player */

"use strict";

//TODO: change block minimum distance so that it measures from the center or something.
//TODO: change initial block generation to be procedural so that there's a guaranteed path to the next ones.. Or we
//Could make a really long block as an initial start.

Object.defineProperty(World, "INIT_BLOCKS", {value: 10});
//TODO: Change block generation to this because then we can use as wide screen as we want
//Use an exponential function with regards to distance travelled since last block, st. at AVG_BLOCKS_PER_100PX the probability of
//A new block is essentially 100%
Object.defineProperty(World, "AVG_BLOCKS_PER_100PX", {value: 30});

//TODO: remove this because otherwise we won't ever
Object.defineProperty(World, "MIN_WAIT_FOR_BLOCK", {value: 30});
Object.defineProperty(World, "MAX_WAIT_FOR_BLOCK", {value: 130});

Object.defineProperty(World, "MULTIPLIER_PROBABILITY", {value: 0.6});

Object.defineProperty(World, "MIN_BLOCK_DIST", {value: 50});

Object.defineProperty(Block, "MAX_WIDTH", {value: 100});
Object.defineProperty(Block, "MIN_WIDTH", {value: 150});

function World() {
	this.width = window.innerWidth;
	this.height = 400;

	this.frame = 0;

	this.player = new Player();
    this.multipliers = [];

	this.collectedMultipliers = [];

	this.player.vx = 0.1;
    this.nextBlockFrame = 0;

	this.initBlocks();
}

World.prototype.tick = function(timePassed) {
  this.player.vx = (Math.exp(this.frame/20000)) / 10;
  this.manageBlocks(timePassed);

	this.player.tick(timePassed, this.blocks);
	this.collectMultipliers(this.player.collideMultipliers(this.multipliers));

	this.frame += 1;
};

World.prototype.collectMultipliers = function(toCollect) {
	for (var i = 0; i < toCollect.length; i++) {
		var index = this.multipliers.indexOf(toCollect[i]);

		this.collectedMultipliers.push(this.multipliers[index]);

		if(index > -1){
			this.player.multiplier.add();
			this.multipliers.splice(index, 1);
		}
	}
};

World.prototype.initBlocks = function() {

	this.blocks = [];

	while(this.blocks.length < World.INIT_BLOCKS) {

		var block = new Block(this);
		block.x = Math.random() * this.width;

		if(!this.isOverlappingAny(block) || this.blockIsTooCloseToAny(block)){
			this.blocks.push(block);

			if(Math.random() > World.MULTIPLIER_PROBABILITY){
				var multiplier;

				do {
					multiplier = new MultiplierPickup(block);
				} while(this.isOverlappingAny(multiplier));

				this.multipliers.push(multiplier);
			}
		}
	}

	var startingBlock = new Block(this);
	startingBlock.y = this.player.height + 20;
	startingBlock.width = Block.MAX_WIDTH * 2;
	startingBlock.x = 0;

	this.blocks.push(startingBlock);

};

World.prototype.manageBlocks = function (timePassed) {
	this.generateBlock();
	this.moveObjects(timePassed);
};

World.prototype.generateBlock = function() {
	if(this.frame >= this.nextBlockFrame) {

		this.nextBlockFrame = this.frame + Utils.randomRange(World.MIN_WAIT_FOR_BLOCK, World.MAX_WAIT_FOR_BLOCK);

		var block;

		do {
			block = new Block(this);
		} while(!this.blockIsValid(block));

		if(Math.random() > World.MULTIPLIER_PROBABILITY){
			var multiplier;

			do {
				multiplier = new MultiplierPickup(block);
			} while(this.isOverlappingAny(multiplier));

			this.multipliers.push(multiplier);
		}

		this.blocks.push(block);
	}
};

World.prototype.moveObjects = function (timePassed) {

	for (var i = 0; i < this.blocks.length ;i++) {

		var block = this.blocks[i];
		block.x -= this.player.vx * timePassed;

		if (block.x + block.width < 0) {
			this.blocks.splice(i, 1);
			i--;
		}
	}

	for(i = 0; i < this.multipliers.length; i++) {

		var multiplier = this.multipliers[i];
		multiplier.x -= this.player.vx * timePassed;

		if (multiplier.x + multiplier.width < 0) {
			this.multipliers.splice(i, 1);
			i--;
		}
	}

};

World.prototype.isOverlappingAny = function (block) {
	for(var i = 0; i < this.blocks.length; i++){
		if(this.blocks[i].isOverlapping(block)){
			return false;
		}
	}

	return false;
};

World.prototype.isValid = function(block) {
	for(var i = 0; i < this.blocks.length; i++){
		if(this.blocks[i].isOverlapping(block) || this.blocks[i].getDist(block) < World.MIN_BLOCK_DIST){
			return false;
		}
	}

	return false;
};

World.prototype.blockIsValid = function(block) {
	var accessible = false;

	for(var i = 0; i < this.blocks.length; i++) {
		var startBlock = this.blocks[i];

		if(block.getDist(startBlock) < World.MIN_BLOCK_DIST) {
			return false;
		}

		if(startBlock.canGetTo(block), this.player.vx){
			accessible = true;
		}
	}

	return accessible;
};

function Block(world){
	this.x = world.width + 100;

	this.width = Utils.randomRange(Block.MIN_WIDTH, Block.MAX_WIDTH);
	this.height = 10;

	this.y = Utils.randomRange(10 + this.height, world.height - 10 - this.height); //TODO: magic numbers
}


Block.prototype.isOverlapping = function (block) {
	if(this.x + this.width < block.x || this.x > block.x + block.width ||
	   this.y + this.height < block.y || this.y > block.y + block.height)  {
		return false;
	}

	return true;
};

Block.prototype.getDist = function (block) {
	return Math.sqrt((block.x - this.x) * (block.x - this.x) + (block.y - this.y) * (block.y - this.y));
};


Block.prototype.canGetTo = function(block, vx) {
	var jumpAndBoostFromRightToLeft = Player.simulateJumpAndBoost((block.x + this.x - this.width) / vx, this.y, 0,
		Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
		Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);

	var jumpAndBoostFromRightToRight = Player.simulateJumpAndBoost((block.x + block.width - this.x - this.width) / vx, this.y, 0,
		Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
		Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);

	var fallToLeft = Player.simulateFall((block.x - this.x - this.width) / vx, this.y, 0,
		Player.GRAVITY_PER_MILLISECOND, Player.MAX_VELOCITY);

	var fallToRight = Player.simulateFall((block.x + block.width - this.x - this.width) / vx, this.y, 0,
		Player.GRAVITY_PER_MILLISECOND, Player.MAX_VELOCITY);

	//TODO: wiggle room?
	return (block.y >= fallToLeft && block.y <= jumpAndBoostFromRightToLeft) ||
	       (block.y >= fallToRight && block.y <= jumpAndBoostFromRightToRight) ||
		   (block.y <= fallToLeft && block.y >= jumpAndBoostFromRightToRight);
};

//TODO: this could be more efficient if we used fallFromRight and then jumpAndBoostFromRight
// Block.prototype.canGetTo = function(block) {
// 	return this.canFallTo(block) || this.canJumpTo(block);
// };

function MultiplierPickup(block){
	this.width = this.height = 15;

	this.x = block.x + Utils.randomRange(5, block.width + 5);
	this.y = block.y - Utils.randomRange(10, 40) - this.height;
}

MultiplierPickup.prototype.getCorners = function() {
	return [{x : this.x,                y : this.y + this.height/2}, //left
		    {x : this.x + this.width/2, y : this.y},				 //top
		    {x : this.x + this.width,   y : this.y + this.height/2}, //right
		    {x : this.x + this.width/2, y : this.y + this.height}];  //bottom
};


//This is kept here because it's the technically right way to calculate it,
//If the formula is ever changed for gravity
//then falling might not intersect with jumping.

// Block.prototype.canFallTo = function(block, vx) {
// 	var fallToLeft = Player.simulateFall((block.x - this.x - this.width) / vx, this.y, 0,
// 		Player.GRAVITY_PER_MILLISECOND, Player.MAX_VELOCITY);
//
// 	var jumpToLeft = Player.simulateJump((block.x - this.x - this.width) / vx, this.y, 0,
//             Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
//             Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
// 	var fallToRight = Player.simulateFall((block.x + block.width - this.x - this.width) / vx, this.y, 0,
// 		Player.GRAVITY_PER_MILLISECOND, Player.MAX_VELOCITY);
//
// 	var jumpToRight = Player.simulateJump((block.x + block.width - this.x - this.width) / vx, this.y, 0,
// 			Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
// 			Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
//
// 	return (block.y >= fallToLeft && block.y <= jumpToLeft) ||
// 	       (block.y >= fallToRight && block.y <= fallToRight) ||
// 		   (block.y <= fallToLeft && block.y >= jumpToRight);
// };
//
// Block.prototype.canJumpTo = function(block, vx) {
// 	var jumpAndBoostFromRightToLeft = Player.simulateJumpAndBoost((block.x + this.x - this.width) / vx, this.y, 0,
// 		Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
// 		Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
// 	var jumpAndBoostFromRightToRight = Player.simulateJumpAndBoost((block.x + block.width - this.x - this.width) / vx, this.y, 0,
// 		Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
// 		Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
// 	var jumpFromLeftToLeft = Player.simulateJump((block.x - this.x) / vx, this.y, 0,
//             Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
//             Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
// 	var jumpFromLeftToRight = Player.simulateJump((block.x + block.width - this.x) / vx, this.y, 0,
// 			Player.JUMP_ACCEL_PER_MILLISECOND, Player.GRAVITY_PER_MILLISECOND,
// 			Player.MAX_VELOCITY, Player.JUMP_LENGTH_IN_MILLISECONDS);
//
// 	return (block.y >= jumpFromLeftToLeft && block.y <= jumpAndBoostFromRightToLeft) ||
// 	       (block.y >= jumpFromLeftToRight && block.y <= jumpAndBoostFromRightToRight) ||
// 		   (block.y <= jumpFromLeftToLeft && block.y >= jumpAndBoostFromRightToRight);
// };
