
Object.defineProperty(World, "INIT_BLOCKS", { value: 10});
Object.defineProperty(World, "MIN_WAIT_FOR_BLOCK", {value: 30});
Object.defineProperty(World, "MAX_WAIT_FOR_BLOCK", {value: 130});
Object.defineProperty(World, "MULTIPLIER_PROBABILITY", {value: .6});

Object.defineProperty(Block, "MAX_WIDTH", { value: 100});
Object.defineProperty(Block, "MIN_WIDTH", { value: 150});

function World() {
	this.width = 480;
	this.height = 320;

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

	while(this.blocks.length < World.INIT_BLOCKS) {
	
		var block = new Block(this);
		block.x = Math.random() * this.width;

		if(!this.isOverlappingAny(block)){
			this.blocks.push(block);	

			if(Math.random() > World.MULTIPLIER_PROBABILITY){
				this.multipliers.push(new MultiplierPickup(block));
			}
		}
	}

	var startingBlock = new Block(this);
	block.y = this.player.height + 10;
	block.width = Block.MAX_WIDTH * 2;
	block.x = 0;

	this.blocks.push(startingBlock);

}

World.prototype.manageBlocks = function () {
	this.generateBlock();
	this.moveObjects();
}

World.prototype.generateBlock = function() {
	if(this.frame >= this.nextBlockFrame) {

		this.nextBlockFrame = this.frame + Utils.randomRange(World.MIN_WAIT_FOR_BLOCK, World.MAX_WAIT_FOR_BLOCK);
		
		var block;

		do {
			block = new Block(this);
		} while(this.isOverlappingAny(block));

		if(Math.random() > World.MULTIPLIER_PROBABILITY){
			this.multipliers.push(new MultiplierPickup(block));
		}

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


function Block(world){
	this.x = world.width + 100;
	this.y = Math.random() * world.height;
	this.width = Utils.randomRange(Block.MIN_WIDTH, Block.MAX_WIDTH);		
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