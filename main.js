var MATT_YOU_DIDNT_SEE_THIS = false;

var FRAME_RATE = 60;

var MULTIPLIER_TIMEOUT = FRAME_RATE * 20; //two seconds jk

var PLAYER_WIDTH = 8;
var PLAYER_HEIGHT = 16;
var PLAYER_X = 50;

var SPACE_BAR = 32;

var world;
var interval_ID;
var frame;
var playing;
var multiplier;

//TODO: this is a hack atm
var player;

init();

function init() {
    frame = 0;
    next_block_frame = 0;
    interval_ID = setInterval(world_loop, 1/FRAME_RATE);

    world = init_world();

    player = world.player;

    playing = true;

    document.addEventListener("keydown", key_down_handler, false);
    document.addEventListener("keydown", matt_ignore_this, false);
    document.removeEventListener("keydown", end_screen_handler, false)
}

//TODO: implement high score with cookies
function get_high_score() {
    return document.cookie;
}

function world_loop(){

    if(is_dead(world.player)){
        draw_scene();
        draw_end_scene(world.player.score);

        document.addEventListener("keydown", end_screen_handler, false)
        playing = false;

        clearInterval(interval_ID);

        return;
    }

    world_tick(frame, world);

    apply_physics(world.player, world.blocks);
    top_collision(world.player, world.blocks);
    bottom_collision(world.player, world.blocks);

    multiplier_collision(world.player, world.multipliers);
    

    //TODO: this is ugly
    calculate_score(world.player, frame);

    draw_scene();
    draw_background();
    draw_blocks(world.blocks);
    draw_multipliers(world.multipliers);

    draw_avatar(world.player);
    draw_boost(world.player);

    draw_score(world.player.score);
    draw_multiplier(world.player.multiplier.value);

    frame++;
}

function calculate_score(player, frame) {
    //TODO: could use a changing function. higher mult = lasts less time.
    if(player.multiplier.value > 1 && frame - player.multiplier.last_pickup > MULTIPLIER_TIMEOUT) {
        player.multiplier.value--;
        player.multiplier.last_pickup = frame;
    }

    player.score += player.multiplier.value;
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
