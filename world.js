"use strict";


Object.defineProperty(World, "INIT_BLOCKS", { value: 10});
Object.defineProperty(World, "MIN_WAIT_FOR_BLOCK", {value: 30});
Object.defineProperty(World, "MAX_WAIT_FOR_BLOCK", {value: 130});
Object.defineProperty(World, "MULTIPLIER_PROBABILITY", {value: 0.6});

Object.defineProperty(Block, "MAX_WIDTH", { value: 100});
Object.defineProperty(Block, "MIN_WIDTH", { value: 150});

function World() {
	this.width = 480;
	this.height = 320;

	this.frame = 0;

	this.player = new Player();
    this.multipliers = [];	

	this.collectedMultipliers = [];

	this.blockMoveSpeed = 0.1;
    this.nextBlockFrame = 0;	

	this.initBlocks();
}

World.prototype.tick = function(timePassed) {
    this.blockMoveSpeed = (Math.exp(this.frame/20000)) / 10;
    this.manageBlocks(timePassed);

	this.player.tick(timePassed);
	this.player.collideBlocks(this.blocks);
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

		if(!this.isOverlappingAny(block)){
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
		} while(this.isOverlappingAny(block));

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
		block.x -= this.blockMoveSpeed * timePassed;

		if (block.x + block.width < 0) {
			this.blocks.splice(i, 1);
			i--;
		}
	}

	for(i = 0; i < this.multipliers.length; i++) {

		var multiplier = this.multipliers[i];
		multiplier.x -= this.blockMoveSpeed * timePassed;
		
		if (multiplier.x + multiplier.width < 0) {
			this.multipliers.splice(i, 1);
			i--;
		}
	}

};

/*
	Blocks can't overlap.
	There can't be a point where it's impossible to make it to a block.
	x       x+width
	___________
	|		  |
	|	______|___
	|__|______|  |
	   |_________|
*/

World.prototype.isOverlappingAny = function (block) {
	for(var i = 0; i < this.blocks.length; i++){
		if(this.blocks[i].isOverlapping(block)){
			return false;
		}
	}

	return false;
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

/*block1 = {'x' : 10, 'width' : 10, 'y' : 10, 'height' : 10};
block2 = {'x' : 15, 'width' : 10, 'y' : 15, 'height' : 10};
block3 = {'x' : 21, 'width' : 10, 'y' : 15, 'height' : 10};
block4 = {'x' : 21, 'width' : 10, 'y' : 21, 'height' : 10};
block5 = {'x' : 0, 'width' : 11, 'y' : 5, 'height' : 10};

console.log(is_overlapping(block1, block2));
console.log(is_overlapping(block1, block3));
console.log(is_overlapping(block1, block4));
console.log(is_overlapping(block1, block5));*/