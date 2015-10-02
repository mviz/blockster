//{'width' : 100, 'x' : 10, 'y' : 10}

var bricks = init_generation();
var BLOCK_WIDTH_MAX = 100;
var BLOCK_WIDTH_MIN = 50;
var BLOCK_HEIGHT = 10;
var FRAME_RATE = 60;
var PLAYER_WIDTH = 5;
var PLAYER_HEIGHT = 10;
var frame = 0;
var player = {'x' : 0, 'y' : 0, 'velocity_y' : 0};

var interval_ID = setInterval(worldLoop, 16);

function worldLoop(){
    apply_physics(player);
    draw_scene();
    draw_bricks(bricks);
    draw_avatar(player);

}
