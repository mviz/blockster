

function top_collision(player) {
	player.isGrounded = false;
	for(var i = 1; i < blocks.length; i++){
		block = blocks[i];
		if (player.y + PLAYER_HEIGHT > block.y &&
			player.y + PLAYER_HEIGHT <= block.y + BLOCK_HEIGHT &&
			PLAYER_X + PLAYER_WIDTH > block.x  &&
			PLAYER_X + PLAYER_WIDTH <= block.x + block.width
			){

			player.y = block.y - PLAYER_HEIGHT;
			player.isGrounded = true;
			break;
		}
	}
}

// function bottom_collision(player) {
// 	for(var i = 1; i < blocks.length; i++){
// 		block = blocks[i];
// 		if (player.y > block.y &&
// 			player.y >= block.y + BLOCK_HEIGHT &&
// 			PLAYER_X < block.x  &&
// 			PLAYER_X >= block.x + block.width
// 			){
// 			player.vy = 0;
// 			//player.y = block.y - PLAYER_HEIGHT;
// 			break;
// 		}
// 	}
// }