var BLOCK_WIDTH_MAX = 150;
var BLOCK_WIDTH_MIN = 100;
var BLOCK_HEIGHT = 10;

var MATT_YOU_DIDNT_SEE_THIS = false;

var FRAME_RATE = 60;

var PLAYER_WIDTH = 8;
var PLAYER_HEIGHT = 16;
var PLAYER_X = 50;

var SPACE_BAR = 32;

var blocks;
var frame;
var player;
var interval_ID;
var block_move_speed;
var playing;

init();



function init() {
    block_move_speed = 1;    
    player = {'x' : 0, 'y' : 0, 'vy' : 1, 'hasJump' : false, 'hasBoost' : true};    
    frame = 0;
    next_block_frame = 0;
    interval_ID = setInterval(world_loop, 1/FRAME_RATE);

    playing = true;

    document.addEventListener("keydown", key_down_handler, false);
    document.addEventListener("keydown", matt_ignore_this, false);
    document.removeEventListener("keydown", end_screen_handler, false)

    blocks = init_blocks();

    blocks.push({'width' : BLOCK_WIDTH_MAX * 2, 
                 'x' : 0, 
                 'y' : PLAYER_HEIGHT + 10
    });
}

//TODO: implement high score with cookies
function get_high_score() {
    return document.cookie;
}

function world_loop(){

    if(is_dead(player)){
        draw_scene();
        draw_end_scene(frame);

        document.addEventListener("keydown", end_screen_handler, false)
        playing = false;

        clearInterval(interval_ID);

        return;
    }

    if(MATT_YOU_DIDNT_SEE_THIS) {
        block_move_speed = Math.abs(Math.sin(frame/50)) * 3;
    } else {
        block_move_speed = (Math.exp(frame/20000));
    }

    apply_physics(player);
    top_collision(player);
    bottom_collision(player);
    
    draw_scene();
    draw_background();
    draw_blocks(blocks);
    draw_avatar(player);
    draw_boost(player);

    draw_score(frame);


    new_block = generate_next_block(frame, blocks);

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

function end_screen_handler(event) {
    if(event.keyCode == SPACE_BAR){
        event.preventDefault();
        init();
    }
}
function matt_ignore_this (event) {
    if(event.keyCode == 16){
        MATT_YOU_DIDNT_SEE_THIS = true;
        canvas.style.transform = "scaleY(-1)"; 
    }
}
