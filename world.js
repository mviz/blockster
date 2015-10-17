var MIN_WAIT_FOR_BLOCK = 30;
var MAX_WAIT_FOR_BLOCK = 130;
var MULTIPLIER_PROBABILITY = .6;
var BLOCK_WIDTH_MAX = 150;
var BLOCK_WIDTH_MIN = 100;
var BLOCK_HEIGHT = 10;

function init_world() {
    
	return {

    	'block_move_speed' : 1,
    	'player' : {'x' : 0, 'y' : 0, 'vy' : 1, 'hasJump' : false, 'hasBoost' : true, 
    				'multiplier' : {'value' : 1, 'last_pickup' : 0},
    				'score' : 0
    			   },
    	'multipliers' : [],
    	'blocks' : init_blocks(),
    	'block_move_speed' : 1,
    	'next_block_frame' : 0
		};
}

function world_tick(frame, world) {

    world.block_move_speed = Math.abs(Math.sin(frame/50)) * 3;

	manage_blocks(frame, world);
}


function init_blocks(world) {
	
	var blocks = [];

	var num_blocks = 20;

	while(blocks.length < 10) {
	
		var block = create_block();
		block.x = Math.random() * canvas.width;
	
		if(!is_overlapping_any(block, blocks)){
			blocks.push(block);	
			
			//TODO: Maybe move this to the create_block code
			//if(Math.random() < MULTIPLIER_PROBABILITY){
			//	world.multipliers.push(create_multiplier(block));
			//1}
		}
	}

	blocks.push({'width' : BLOCK_WIDTH_MAX * 2, 
                 'x' : 0, 
                 'y' : PLAYER_HEIGHT + 10
    });

    return blocks;
}

function manage_blocks(frame) {
	generate_block_if_needed(frame, world);
	move_objects(world);
}

function generate_block_if_needed(frame, world) {
	if(frame >= world.next_block_frame) {

		world.next_block_frame = frame + randomRange(MIN_WAIT_FOR_BLOCK, MAX_WAIT_FOR_BLOCK);
		
		var block;

		do {
			block = create_block();
		} while(is_overlapping_any(block, world.blocks));

		//TODO: Maybe move this to the create_block code
		if(Math.random() < MULTIPLIER_PROBABILITY){
			world.multipliers.push(create_multiplier(block));
		}

		world.blocks.push(block);
	} 
}

function move_objects(world) {
	for(var i = 0; i < world.blocks.length ;i++) {

		var block = world.blocks[i];

		//TODO: implement me. 		
		if(block.x + block.width < 0) {
			world.blocks.splice(i, 1);
			i--;
		}

		block.x -= world.block_move_speed;
	}

	for(var i = 0; i < world.multipliers.length ;i++) {

		var multiplier = world.multipliers[i];

		//TODO: implement me. 		
		if(multiplier.x + MULTIPLIER_WIDTH < 0) {
			world.multipliers.splice(i, 1);
			i--;
		}

		multiplier.x -= world.block_move_speed;
	}

}


function create_multiplier(block) {
	//TODO: remove the magic numbers
	return {'x' : block.x + randomRange(5, block.width + 5), 
			'y' : block.y - randomRange(10, 40)};
}

function create_block() {
	return {'width' : randomRange(BLOCK_WIDTH_MIN, BLOCK_WIDTH_MAX), 
			'x' : canvas.width + 100, 
			'y' : Math.random() * canvas.height};
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

function is_overlapping_any(target_block, blocks) {
	for(var i = 0; i< blocks.length; i++){
		if(is_overlapping(target_block, blocks[i])){
			return true;
		}
	}
	return false;
}

function is_overlapping(block1, block2) {
	if(block1.x + block1.width < block2.x || block1.x > block2.x + block2.width ||
	   block1.y + BLOCK_HEIGHT < block2.y || block1.y > block2.y + BLOCK_HEIGHT)  {
		return false;
	}

	return true;
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