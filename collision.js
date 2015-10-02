

function top_collision(player) {
	for(var i = 1; i < blocks.length; i++){
		block = blocks[i];
		if (player.y + PLAYER_HEIGHT > block.y &&
			player.y + PLAYER_HEIGHT >= block.y + BLOCK_HEIGHT ){

		}
	}

}