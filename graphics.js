var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var AVATAR_COLOR = "#3DB845";
var block_color = "#00A3FB";
var LINE_COLOR = "#AAAAAA";
var BOOST_COLOR = "#BF4040";
var HIGHLIGHT_COLOR = "#FFCF70";
var MULTIPLIER_COLOR = "#F2DB00"

var BLOCK_HEIGHT = 40;
var NUM_LINES = 20;

var MAX_LINE_STROKE_WIDTH = 2;
var MIN_LINE_STROKE_WIDTH = 0.5;
var MAX_LINE_SPEED = 1;
var MIN_LINE_SPEED = .1;
var MIN_LINE_WIDTH = 100;
var MAX_LINE_WIDTH = 150;

var MAX_MULTIPLIER_BAR_WIDTH = 100;
var MULTIPLIER_BAR_HEIGHT = 5;
var MULTIPLIER_WIDTH = 10;

var lines;

function init_graphics() {
    init_lines();
}

function draw_scene() {
    context.clearRect(0,0, canvas.width, canvas.height);       
}

function draw_avatar(player) {    
    context.fillStyle = AVATAR_COLOR;
    context.fillRect(PLAYER_X , player.y , PLAYER_WIDTH, PLAYER_HEIGHT);
}

function draw_boost(player) {
    // Styling was a bit of an accident, but hey, I like it.
    // a - - - b
    //   - - -
    //   c - d 
    //     e
    if(player.vy < 0){
        var a = {'x': 0,                              'y': 0};
        var b = {'x': PLAYER_WIDTH,                   'y': 0};
        var c = {'x': Math.floor(PLAYER_WIDTH/4),     'y': 7};
        var d = {'x': Math.floor(PLAYER_WIDTH*(3/4)), 'y': 7};
        var e = {'x': Math.floor(PLAYER_WIDTH/2),     'y': 10};
        
        context.save();

        context.translate(PLAYER_X, player.y + PLAYER_HEIGHT);

        var body = [a,b,d,c,a];
        var tip = [c,e,d,c];

        context.fillStyle = BOOST_COLOR;
        draw_path(body);
        context.fill();


        context.fillStyle = HIGHLIGHT_COLOR;
        draw_path(tip);
        context.fill();

        context.restore();
    }
}

function draw_path(path) {
    context.moveTo(path[0].x, path[0].y);
    for(i = 1; i < path.length; i++){
        context.lineTo(path[i].x, path[i].y);
    }
}

function draw_multipliers(multipliers){
    multipliers.forEach(function (multiplier) {
        context.save();

        context.translate(multiplier.x + MULTIPLIER_WIDTH / 2, multiplier.y + MULTIPLIER_WIDTH / 2);
        context.rotate(Math.PI / 4);

        context.fillStyle = MULTIPLIER_COLOR;

        context.fillRect(-MULTIPLIER_WIDTH / 2, -MULTIPLIER_WIDTH / 2,
                     MULTIPLIER_WIDTH, MULTIPLIER_WIDTH);
        
        context.restore();
    });
}

function draw_blocks(blocks){
    blocks.forEach(function (block) {
        //context.beginPath();
        context.fillStyle = block_color;
        context.fillRect(block.x, block.y , block.width, BLOCK_HEIGHT);
        //context.fill();
    });
}

function draw_score(score) {
    context.fillStyle = AVATAR_COLOR;
    context.font = "30px Arial";
    context.textAlign = "right";
    context.fillText(score, canvas.width, 30);
}

function draw_multiplier(multiplier, frame) {

    if(multiplier.value != 1){
        var percent_left = get_multiplier_time_left(multiplier, frame)/get_total_time_for_mutliplier(multiplier);
        var bar_width = percent_left * MAX_MULTIPLIER_BAR_WIDTH;

        context.fillStyle = MULTIPLIER_COLOR;
        context.fillRect(canvas.width - bar_width, 55, bar_width, MULTIPLIER_BAR_HEIGHT);
        //context.fill();
    }

    context.fillStyle = MULTIPLIER_COLOR;
    context.font = "20px Arial";
    context.textAlign = "right";
    context.fillText(multiplier.value + 'x', canvas.width, 50);
}

function draw_end_scene(score) {
    context.fillStyle = "#000000";

    context.font = "30px Helvetica";
    context.textAlign = "center";
    context.fillText(score, canvas.width/2, canvas.height/2);

    context.font = "30px Helvetica";
    context.textAlign = "center";
    context.fillText("Press space to continue", canvas.width/2, canvas.height/2 + 30);
}

// Of the form {stroke_width : 10, width: 100, x : 20, speed : 10}

function draw_background() {
    for(i = 0 ; i < lines.length; i++) {
        line = lines[i];

        line.x += line.speed;

        if(line.x - 10 > canvas.width) {
            lines.splice(i, 1);
        
            lines.push(create_line());

            continue;
        }

        context.beginPath();

        context.lineWidth = line.stroke_width;
        context.strokeStyle = LINE_COLOR;
        context.moveTo(line.x, line.y);
        context.lineTo(line.x + line.width, line.y);
        context.stroke();
    }

}

function init_lines() {
    lines = [];
    for(i = 0; i < NUM_LINES; i++){
        var line = create_line();
        line.x = Math.random() * canvas.width;
        lines.push(line);
    }
}

function create_line() {
    var stroke_width = randomRange(MIN_LINE_STROKE_WIDTH, MAX_LINE_STROKE_WIDTH);
    var scaled = (stroke_width - 0.4)/15;
    var delta = .1;
    var line_speed = randomRange(scaled - delta, scaled + delta);
    return {"stroke_width" : stroke_width, 
            "speed" : line_speed, 
            "x" : -150, 
            "y" : Math.random() * canvas.height, 
            "width" : randomRange(MIN_LINE_WIDTH, MAX_LINE_WIDTH)};
}

