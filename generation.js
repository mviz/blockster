
function init_generation() {
	var blocks = [];

	var num_blocks = 20;

	for(i = 0; i < num_blocks; i++) {
		blocks.push({'width' : (Math.random() * BLOCK_WIDTH_MAX) + BLOCK_WIDTH_MAX, 
					'x' : Math.random() * canvas.width, 
					'y' : Math.random() * canvas.height
		});
	}

	return blocks;
}

var next_block_frame = 0;

function generate_next_block() {
	
	if(frame >= next_block_frame) {

		return {'width' : (Math.random() * BLOCK_WIDTH_MAX) + BLOCK_WIDTH_MAX, 
					'x' : canvas.width + 100, 
					'y' : Math.random() * canvas.height};


		next_block_frame = Math.random() * 1 / FRAME_RATE;

	} 

	return null;
}
