//{'width' : 100, 'x' : 10, 'y' : 10}

var brickList = init_generation();
var BLOCK_WIDTH_MAX = 100;
var BLOCK_WIDTH_MIN = 50;
var BLOCK_HEIGHT = 10;
var FRAME_RATE = 60;
var frame = 0;
var player = {'x' : 0, 'y' : 0, 'velocityY' : 0}

var interval_ID = setInterval(worldLoop, 16);

function worldLoop(){
    applyPhysics();
    draw();
}

