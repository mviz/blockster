//{'width' : 100, 'x' : 10, 'y' : 10}

var bricks = init_generation();
var BLOCK_WIDTH_MAX = 100;
var BLOCK_WIDTH_MIN = 50;
var BLOCK_HEIGHT = 10;
var FRAME_RATE = 60;
var PLAYER_WIDTH = 5;
var PLAYER_HEIGHT = 10;
var frame = 0;
var player = {'x' : 0, 'y' : 0, 'vy' : 0};

var interval_ID = setInterval(worldLoop, 1/FRAME_RATE);
var brick_move_speed = 1;


function worldLoop(){
    apply_physics(player);
    top_collision();
    draw_scene();
    draw_bricks(bricks);
    draw_avatar(player);

    new_brick = generate_next_block(frame);

    if(new_brick) {
    	bricks.push(new_brick);
    }

    move_bricks(bricks);

    frame++;
}

function move_bricks(bricks) {
	for(var i = 0; i < bricks.length ;i++) {
		bricks[i].x -= brick_move_speed;
	}
}