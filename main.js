var FRAME_RATE = 60;

var PLAYER_WIDTH = 8;
var PLAYER_HEIGHT = 16;
var PLAYER_X = 50;

var SPACE_BAR = 32;

var world;
var interval_ID;
var frame;
var playing;
var multiplier;

init();

function init() {
    frame = 0;
    next_block_frame = 0;
    interval_ID = setInterval(world_loop, 1/(FRAME_RATE * 1000));

    world = init_world();

    player = world.player;

    playing = true;

    document.addEventListener("keydown", key_down_handler, false);
    canvas.addEventListener("touchstart", jump, false);    
    canvas.removeEventListener("touchstart", play_again, false);

    init_graphics();
}

//TODO: implement high score with cookies
function get_high_score() {
    return document.cookie;
}

function world_loop(){

    if(is_dead(world.player)){
        draw_scene();
        draw_end_scene(world.player.score);

        document.addEventListener("keydown", key_down_handler, false)
        canvas.addEventListener("touchstart", play_again, false)
        playing = false;

        clearInterval(interval_ID);

        return;
    }

    world_tick(frame, world);

    apply_physics(world.player, world.blocks);
    top_collision(world.player, world.blocks);
    bottom_collision(world.player, world.blocks);

        calculate_score(world.player, frame);


    multiplier_collision(world.player, world.multipliers);
    

    draw_scene();
    draw_background();
    draw_blocks(world.blocks);
    draw_multipliers(world.multipliers);

    draw_avatar(world.player);
    draw_boost(world.player);

    draw_score(world.player.score);
    draw_multiplier(world.player.multiplier, frame);

    frame++;
}

function calculate_score(player, frame) {
    if(player.multiplier.value > 1 && get_multiplier_time_left(player.multiplier, frame) <= 0){
        player.multiplier.value--;
        player.multiplier.last_pickup = frame;
    }

    player.score += player.multiplier.value;
}

function play_again(event) {

    if(event !== undefined) {
        event.preventDefault();    
    }
    
    init();
}