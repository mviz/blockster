

function top_collision(player, blocks) {
	player.hasJump = false;
	for(var i = 0; i < blocks.length; i++){
		block = blocks[i];
		if (player.y + PLAYER_HEIGHT > block.y &&
			player.y + PLAYER_HEIGHT <= block.y + BLOCK_HEIGHT &&
			PLAYER_X + PLAYER_WIDTH > block.x  &&
			PLAYER_X <= block.x + block.width
			){

			player.y = block.y - PLAYER_HEIGHT;
			player.hasJump = true;
			player.hasBoost = true;
			break;
		}
	}
}

function bottom_collision(player, blocks) {
	for(var i = 0; i < blocks.length; i++){
		block = blocks[i];
		if (player.y > block.y &&
			player.y <= block.y + BLOCK_HEIGHT &&
			PLAYER_X + PLAYER_WIDTH > block.x  &&
			PLAYER_X <= block.x + block.width
			){
			player.vy = 0;
			player.y = block.y + BLOCK_HEIGHT;
			break;
		}
	}
}


/*	
    |		/\
    |		\/

	as an approximation, we just need to check if one of the three points (top, middle, bottom) 
	lies inside the multiplier
*/


function multiplier_collision(player, multipliers) {

	var player_points = [{'x' : player.x + PLAYER_WIDTH, 'y' : player.y},  				   //top right
						 {'x' : player.x + PLAYER_WIDTH, 'y' : player.y + PLAYER_HEIGHT/2},//middle right
						 {'x' : player.x + PLAYER_WIDTH, 'y' : player.y + PLAYER_HEIGHT},  //bottom right
						 {'x' : player.x, 'y' : player.y + PLAYER_HEIGHT}, 				   //bottom left
						 {'x' : player.x, 'y' : player.y}];				   				   //top left
						 // no need for middle left because that cant collide due to moving right

	for(var i = 0; i < multipliers.length; i++) {

		var multiplier = multipliers[i];

		var multiplier_points = [{'x' : multiplier.x, 					   'y' : multiplier.y + MULTIPLIER_WIDTH/2}, //left
								 {'x' : multiplier.x + MULTIPLIER_WIDTH/2, 'y' : multiplier.y + MULTIPLIER_WIDTH},   //bottom
								 {'x' : multiplier.x + MULTIPLIER_WIDTH,   'y' : multiplier.y + MULTIPLIER_WIDTH/2}, //right
								 {'x' : multiplier.x + MULTIPLIER_WIDTH/2, 'y' : multiplier.y}  					//top
								];

		for(var j = 0; j <  player_points.length; j++) {
			if(contains(player_points[j], multiplier_points)) {
				player.multiplier.value++;
				player.last_pickup = frame;
				
				multipliers.splice(i, 1);
				i--;

				break;				
			}
		}
	}


}


//http://stackoverflow.com/a/8721483 needed a quick solution
function contains(point, points) {
    
    var result = false;
    var j = points.length - 1;

    for (var i = 0; i < points.length; j = i++) {
        if ((points[i].y > point.y) != (points[j].y > point.y) &&
  	      (point.x < (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
    	    result = !result;
       	}
    }

    return result;
}
