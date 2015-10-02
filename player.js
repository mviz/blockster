
var GRAVITY = +1;


function apply_physics(player) {
	player.vy += GRAVITY;
	player.y  += player.vy;
}