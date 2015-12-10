var FRAME_RATE = 60;

var SPACE_BAR = 32;

var world;
var interval;
var frame;
var playing;
var player;
var graphics;

var game_width = 480; //TODO: move these to world
var game_height = 320;

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerWidth * game_height/game_width;

if(canvas.height > window.innerHeight){
    
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * game_width / game_height;

}

context.scale(canvas.width / game_width, canvas.height / game_height); 


init();

function init() {
    frame = 0;
    next_block_frame = 0;
    interval = setInterval(world_loop, 1/(FRAME_RATE * 1000));

    world = new World();

    player = world.player; //TODO: this seems weird

    playing = true; //TODO: also a weird variable

    document.addEventListener("keydown", key_down_handler, false);
    canvas.addEventListener("touchstart", player.jump, false);    
    canvas.removeEventListener("touchstart", play_again, false);

    graphics = new Graphics(world, canvas, context);
}

//TODO: implement high score with cookies
function get_high_score() {
    return document.cookie;
}

function world_loop(){

    if(player.isDead()){
        
        graphics.drawEndScene(world.player.score);

        document.addEventListener("keydown", key_down_handler, false)
        canvas.addEventListener("touchstart", play_again, false)
        playing = false;

        clearInterval(interval);

        return;
    }

    world.tick();
    player.tick(world); //TODO: this shouldn't be this way, two way dependency
    graphics.draw();
}


function play_again(event) {
    if(event !== undefined) {
        event.preventDefault();    
    }
    
    init();
}