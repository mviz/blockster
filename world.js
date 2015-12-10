var MIN_WAIT_FOR_BLOCK = 30;
var MAX_WAIT_FOR_BLOCK = 130;
var MULTIPLIER_PROBABILITY = .6;
var BLOCK_WIDTH_MAX = 150;
var BLOCK_WIDTH_MIN = 100;

//TODO: the world should have a height seperate from the canvas, and width

function World() {
   	this.blockMoveSpeed = 1;
	this.player = new Player();
    this.multipliers = [];	
	this.blockMoveSpeed = 1;
    this.nextBlockFrame = 0;
	this.frame = 0;
	this.initBlocks();
}

World.prototype.tick = function() {
    this.blockMoveSpeed = (Math.exp(this.frame/20000));
    this.manageBlocks();
	
	this.frame += 1;
}


World.prototype.initBlocks = function() {
	
	this.blocks = [];

	var num_blocks = 20;

	while(this.blocks.length < 10) {
	
		var block = this.createBlock(Math.random() * canvas.width);

		if(!this.isOverlappingAny(block)){
			this.blocks.push(block);	
		}
	}

	this.blocks.push(new Block(BLOCK_WIDTH_MAX * 2, 0, this.player.height + 10));

}

World.prototype.manageBlocks = function () {
	this.generateBlock();
	this.moveObjects();
}

World.prototype.generateBlock = function() {
	if(this.frame >= this.nextBlockFrame) {

		this.nextBlockFrame = this.frame + Utils.randomRange(MIN_WAIT_FOR_BLOCK, MAX_WAIT_FOR_BLOCK);
		
		var block;

		do {
			block = this.createBlock();
		} while(this.isOverlappingAny(block));

		this.blocks.push(block);
	} 
}

World.prototype.moveObjects = function () {

	for(var i = 0; i < this.blocks.length ;i++) {

		var block = this.blocks[i];

		if(block.x + block.width < 0) {
			this.blocks.splice(i, 1);
			i--;
		}

		block.x -= this.blockMoveSpeed;
	}

	for(var i = 0; i < this.multipliers.length ;i++) {

		var multiplier = this.multipliers[i];

		if(multiplier.x + multiplier.width < 0) {
			this.multipliers.splice(i, 1);
			i--;
		}

		multiplier.x -= this.blockMoveSpeed;
	}

}

World.prototype.createBlock = function (x) {
	if(x === undefined) {
		x = canvas.width + 100;
	}

	//TODO: this could be cleaned up more
	var block = new Block(x, Math.random() * canvas.height, Utils.randomRange(BLOCK_WIDTH_MIN, BLOCK_WIDTH_MAX));

	if(Math.random() < MULTIPLIER_PROBABILITY){
		this.multipliers.push(new MultiplierPickup(block));
	}

	return block;
}

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
		if(block.isOverlapping(this.blocks[i])){
			return false;
		}
	}

	return false;
}


function Block(x,y,width){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = 10;
}


Block.prototype.isOverlapping = function (block) {
	if(this.x + this.width < block.x || this.x > block.x + block.width ||
	   this.y + this.height < block.y || this.y > block.y + block.height)  {
		return false;
	}

	return true;
}

function MultiplierPickup(block){
	this.x = block.x + Utils.randomRange(5, block.width + 5);
	this.y = block.y - Utils.randomRange(10, 40);

	this.width = 10;
	this.height = 10;
}

/*block1 = {'x' : 10, 'width' : 10, 'y' : 10, 'height' : 10};
block2 = {'x' : 15, 'width' : 10, 'y' : 15, 'height' : 10};
block3 = {'x' : 21, 'width' : 10, 'y' : 15, 'height' : 10};
block4 = {'x' : 21, 'width' : 10, 'y' : 21, 'height' : 10};
block5 = {'x' : 0, 'width' : 11, 'y' : 5, 'height' : 10};

console.log(is_overlapping(block1, block2));
console.log(is_overlapping(block1, block3));
console.log(is_overlapping(block1, block4));
console.log(is_overlapping(block1, block5));*/