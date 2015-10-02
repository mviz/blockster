
var GRAVITY = -9.81;


function apply_physics(player) {

	player.velocityY += GRAVITY;
	player.y  += player.velocity_y;
}