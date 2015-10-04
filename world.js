//{'width' : 100, 'x' : 10, 'y' : 10}

var blocks = init_blocks();
var BLOCK_WIDTH_MAX = 100;
var BLOCK_WIDTH_MIN = 50;
var BLOCK_HEIGHT = 10;
var FRAME_RATE = 60;
var PLAYER_WIDTH = 8;
var PLAYER_HEIGHT = 16;
var PLAYER_X = 50;
var frame = 0;
var player = {'x' : 0, 'y' : 0, 'vy' : 1, 'isGrounded' : false, 'canDoubleJump' : true};

var interval_ID = setInterval(worldLoop, 1/FRAME_RATE);
var block_move_speed = 1;
document.addEventListener("keydown", keyDownHandler, false);


function reset() {
    block_move_speed = 1;    
    player.y = 0;
    playervy = 1;
    player.isGrounded = false;

    blocks = init_blocks();
}

function worldLoop(){

    if(is_dead(player)){
        reset();
    }

    apply_physics(player);
    top_collision(player);
    draw_scene();
    draw_blocks(blocks);
    draw_avatar(player);

    new_block = generate_next_block(frame);

    if(new_block) {
    	blocks.push(new_block);
    }

    move_blocks(blocks);

    frame++;
}

function move_blocks(blocks) {
	for(var i = 0; i < blocks.length ;i++) {
		blocks[i].x -= block_move_speed;
	}

}



