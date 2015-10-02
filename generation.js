var MAGIC_NUMBER = 200;

function init_generation() {
	var blocks = [];

	var num_blocks = 10;

	for(i = 0; i < num_blocks; i++) {
		blocks.push({'width' : (Math.random() * 50) + 70, 
					'x' : Math.random() * canvas.width, 
					'y' : Math.random() * canvas.height
		});
	}

	return blocks;
}

var next_block_frame = 0;

function generate_next_block(frame) {


	if(frame >= next_block_frame) {

		next_block_frame = frame + Math.random() * MAGIC_NUMBER;

		return {'width' : (Math.random() * BLOCK_WIDTH_MAX) + BLOCK_WIDTH_MAX, 
					'x' : canvas.width + 100, 
					'y' : Math.random() * canvas.height};


		

	} 

	return null;
}
