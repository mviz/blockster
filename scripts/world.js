/* jshint browser: true */
/* jshint -W097 */
/* global Utils */
/* global Player */

"use strict";

//TODO: could we make a multiplier compose a block and therefore simplify their lifecycles?
//Then when we draw them we HAVE to draw both at the same time..

//TODO: fix the "remove multipliers" workflow. Maybe the world should handle physics and collision...
//This would actually make a LOT of sense

//TODO: keep blocks a sorted list by x values. This simplifies block removal, and when to generate a new block.

//TODO: change block minimum distance so that it measures from the center or something.

Object.defineProperty(Block, "MAX_WIDTH", {value: 100});
Object.defineProperty(Block, "MIN_WIDTH", {value: 150});

Object.defineProperty(World, "BLOCK_GENERATION_THRESHOLD", {value: 3});


function World() {
	this.width = window.innerWidth;
	this.height = 400;

	this.player = new Player();
	this.blocks = [];
	this.collectedMultipliers = [];

	var startingBlock = new Block(0, this.player.height + 40);
	startingBlock.width = Block.MAX_WIDTH * 2;
	this.addBlock(startingBlock);

	this.worldGenerator = new WorldGenerator(startingBlock);

	this.player.vx = 0.1;
}

World.prototype.getBlockGenerationThreshold = function () {
	return this.width * World.BLOCK_GENERATION_THRESHOLD;
};

World.prototype.tick = function(timePassed) {
  	this.player.vx += 0.000001 * timePassed;

	this.manageBlocks(timePassed);
	this.collide();
	this.player.tick(timePassed, this.blocks);
};

World.prototype.collide = function() {
    this.player.touchingBlock = undefined;

    var i = 0;

    while(i < this.blocks.length && this.blocks[i].x < this.width) {
		var block = this.blocks[i];

        if(block.collides(this.player)) {
            if(this.player.vy < 0) {
                this.player.vy = 0;
                this.player.y = block.y + block.height + 2;
            } else {
                this.player.touchingBlock = block;
                this.player.hasBoost = true;
            }
        }

        if(block.multiplier && block.multiplier.collides(this.player)) {
			this.collectedMultipliers.push(block.multiplier);
			block.multiplier = undefined;
        }
		i++;
	}
};

World.prototype.manageBlocks = function (timePassed) {
	while(!this.blocks.length || this.blocks[this.blocks.length - 1].x < this.getBlockGenerationThreshold()){
		this.worldGenerator.generate(this);
	}

	this.moveObjects(timePassed);
};

World.prototype.moveObjects = function (timePassed) {
	var moveAmount = this.player.vx * timePassed;
	this.lastBlockX -= this.player.vx;

	for (var i = 0; i < this.blocks.length ;i++) {

		var block = this.blocks[i];
		block.x -= moveAmount;

		if (block.x + block.width < 0) {
			this.blocks.shift();
			i--;
		}
	}
};

World.prototype.addBlock = function(block) {
	var i = this.blocks.length;

	while(i > 0 &&  block.x < this.blocks[i - 1].x) {
		i--;
	}

	this.blocks.splice(i, 0, block);
};

World.prototype.popCollectedMultipliers = function() {
	var collectedMultipliersTemp = this.collectedMultipliers;
	this.collectedMultipliers = [];

	return collectedMultipliersTemp;
};

Object.defineProperty(WorldGenerator, "CREATE_NODE_PROBABILITY", {value: 0.1});
Object.defineProperty(WorldGenerator, "TERMINATE_NODE_PROBABILITY", {value: 0.1});
Object.defineProperty(WorldGenerator, "MIN_NODES", {value: 1});
Object.defineProperty(WorldGenerator, "MAX_NODES", {value: 5});
Object.defineProperty(WorldGenerator, "MIN_BLOCK_DIST", {value: 50});

function WorldGenerator(startingBlock) {
	this.nodes = [startingBlock];
}

WorldGenerator.prototype.generate = function(world) {
	//NOTE: this will generate the nodes that we create too...
	//debugger;
	for(var i = 0; i < this.nodes.length; i++) {
		//Chance to end this node.
		if(this.nodes.length > WorldGenerator.MIN_NODES && Math.random() < WorldGenerator.TERMINATE_NODE_PROBABILITY) {
			this.nodes.pop(i);
			i--;
			continue;
		}

		if(this.nodes.length < WorldGenerator.MAX_NODES && Math.random < WorldGenerator.CREATE_NODE_PROBABILITY) {
			this.nodes.push(this.generateBlock(this.nodes[i], world));
		}

		this.nodes[i] = this.generateBlock(this.nodes[i], world);
	}
};

WorldGenerator.prototype.generateBlock = function(startBlock, world) {
	//Random x coord between block.x and some predetermined dist.
	//Then create a block with it.
	//Test it against min dist etc (extract this to a function on world maybe)
	//if it is reachable, tell the world to add it, then return it.

	/*var block;

	var maxX = world.player.vx * startBlock.x;
	var t = (world.height - startBlock.y ) / Player.MAX_VELOCITY;
	var estX = world.player.vx * t;

	*/


	/*
	do {
		block = new Block(Utils.randomRange(startBlock.x, startBlock.x + world.width / 2), Utils.randomRange(0, world.height));
	} while (!(startBlock.canGetTo(block)));// && startBlock.getDist(block) > WorldGenerator.MIN_BLOCK_DIST));
	*/

	var block = new Block(Utils.randomRange(startBlock.x, startBlock.x + world.width / 4), Utils.randomRange(0, world.height));

	//TODO: mindist only measures against one block.
	world.addBlock(block);

	return block;
};

Object.defineProperty(Block, "MULTIPLIER_PROBABILITY", {value: 0.6});

function Block(x, y){
	this.x = x;
	this.y = y;

	this.width = Utils.randomRange(Block.MIN_WIDTH, Block.MAX_WIDTH);
	this.height = 10;

	if(Math.random() < Block.MULTIPLIER_PROBABILITY) {
		this.multiplier = new MultiplierPickup(this);
	}
}

Block.prototype.collides = function (o) {
	if(this.x + this.width < o.x || this.x > o.x + o.width ||
	   this.y + this.height < o.y || this.y > o.y + o.height)  {
		return false;
	}

	return true;
};

Block.prototype.getDist = function (block) {
	return Math.sqrt((block.x - this.x) * (block.x - this.x) + (block.y - this.y) * (block.y - this.y));
};


//TODO: we could simplify these calls by using x rather than t in the function itself
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

	//TODO: wiggle room? A block you can JUST get to will be near impossible...
	return (block.y >= fallToLeft && block.y <= jumpAndBoostFromRightToLeft) ||
	       (block.y >= fallToRight && block.y <= jumpAndBoostFromRightToRight) ||
		   (block.y <= fallToLeft && block.y >= jumpAndBoostFromRightToRight);
};

function MultiplierPickup(block){
	this.block = block;
	this.width = this.height = 15;

	this.x = Utils.randomRange(5, block.width + 5);
	this.y = Utils.randomRange(-this.height, -this.height * 4);
}

MultiplierPickup.prototype.getX = function() {
	return this.block.x + this.x;
};

MultiplierPickup.prototype.getY = function() {
	return this.block.y + this.y;
};

MultiplierPickup.prototype.getCorners = function() {
	return [{x : this.block.x + this.x,                  y : this.block.y + this.y + this.height / 2}, //left
		    {x : this.block.x + this.x + this.width / 2, y : this.block.y + this.y},				 //top
		    {x : this.block.x + this.x + this.width,     y : this.block.y + this.y + this.height / 2}, //right
		    {x : this.block.x + this.x + this.width / 2, y : this.block.y + this.y + this.height}];  //bottom
};

MultiplierPickup.prototype.collides = function(player) {
    var playerPoints = player.getPoints();

    for(var i = 0; i <  playerPoints.length; i++) {
        if(Utils.contains(playerPoints[i], this.getCorners())) {
            return true;
        }
    }

    return false;
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
