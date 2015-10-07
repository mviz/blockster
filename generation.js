var MIN_WAIT_FOR_BLOCK = 50;
var MAX_WAIT_FOR_BLOCK = 200;

function init_blocks() {
	
	var blocks = [];

	var num_blocks = 20;

	while(blocks.length < 10) {
	
		var block = create_block();
		block.x = Math.random() * canvas.width;
	
		if(!is_overlapping_any(block, blocks)){
			blocks.push(block);	
		}
	}

	return blocks;
}

var next_block_frame = 0;
function generate_next_block(frame, blocks) {
	if(frame >= next_block_frame) {

		next_block_frame = frame + randomRange(MIN_WAIT_FOR_BLOCK, MAX_WAIT_FOR_BLOCK);
		var block;

		do {
			block = create_block();
		} while(is_overlapping_any(block, blocks));

		return block;		

	} 

	return null;
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