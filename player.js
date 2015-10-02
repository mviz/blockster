var GRAVITY = -9.81;


function applyPhysics(player) {

	player.velocityY += GRAVITY;
	player.y  += player.velocityY;
}