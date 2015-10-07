var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var AVATAR_COLOR = "#FFE64D";
var block_color = "#6FC3DF";
var LINE_COLOR = "#E6FFFF";
var BOOST_COLOR = "#DF740C";
var HIGHLIGHT_COLOR = "#DF740C";
var BLOCK_HEIGHT = 40;
var NUM_LINES = 20;

var MAX_LINE_STROKE_WIDTH = 2;
var MIN_LINE_STROKE_WIDTH = 0.5;
var MAX_LINE_SPEED = 1;
var MIN_LINE_SPEED = .1;
var MIN_LINE_WIDTH = 100;
var MAX_LINE_WIDTH = 150;

var cur_color = "#000000";

function draw_scene() {
    if(MATT_YOU_DIDNT_SEE_THIS) {
        if(frame % 80 == 0) {
            //Taken from http://stackoverflow.com/a/1484514

            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            cur_color = color;
        }

        context.rect(0,0, canvas.width, canvas.height);
        
        context.fillStyle = cur_color;
        context.fill();

    } else {
        context.clearRect(0,0, canvas.width, canvas.height);    
    }
    
}

function draw_avatar(player) {
    context.beginPath();
    context.rect(PLAYER_X , player.y , PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillStyle = AVATAR_COLOR;
    context.fill();
}

function draw_boost(player) {
    // Styling was a bit of an accident, but hey, I like it.
    // a - - - b
    //   - - -
    //   c - d 
    //     e
    if(player.vy < 0){
        var path = new Path2D();

        var a = {'x': 0,                              'y': PLAYER_HEIGHT};
        var b = {'x': PLAYER_WIDTH,                   'y': PLAYER_HEIGHT};
        var c = {'x': Math.floor(PLAYER_WIDTH/4),     'y': PLAYER_HEIGHT + 7};
        var d = {'x': Math.floor(PLAYER_WIDTH*(3/4)), 'y': PLAYER_HEIGHT + 7};
        var e = {'x': Math.floor(PLAYER_WIDTH/2),     'y': PLAYER_HEIGHT + 10};
        
        context.save();

        context.beginPath();
        context.translate(PLAYER_X, player.y);

        var body = [a,b,d,c,a];
        var tip = [c,e,d,c];

        draw_path(body);

        context.fillStyle = BOOST_COLOR;
        context.fill();

        draw_path(tip);
        
        context.fillStyle = HIGHLIGHT_COLOR;
        context.fill();

        context.restore();
    }
}

function draw_path(path) {
    for(i = 0; i < path.length; i++){
        context.lineTo(path[i].x, path[i].y);
    }
}


function draw_blocks(blocks){
    blocks.forEach(function (block) {
        context.beginPath();
        context.rect(block.x, block.y , block.width, BLOCK_HEIGHT);
        context.fillStyle = block_color;
        context.fill();
    });
}

function draw_score(score) {
    context.fillStyle = AVATAR_COLOR;
    context.font = "30px Arial";
    context.textAlign = "right";
    context.fillText(score, canvas.width, 30);
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
//TODO: init lines every time the game is reset
var lines = [];
init_lines();

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

function draw_trail(trail, frame){
    for(var i = 0; i < PLAYER_X; i++){
        context.beginPath();
        context.rect(i, trail[(frame + i) % PLAYER_X] , 1, 1);
        context.fillStyle = LINE_COLOR;
        context.fill();
    }
}

function init_lines() {
    for(i = 0; i < NUM_LINES; i++){
        var line = create_line();
        line.x = Math.random() * canvas.width;
        lines.push(line);
    }
}

function create_line() {
    var stroke_width = randomRange(MIN_LINE_STROKE_WIDTH, MAX_LINE_STROKE_WIDTH);
    var scaled = (stroke_width - 0.4)/1.5;
    var delta = .1;
    var line_speed = randomRange(scaled - delta, scaled + delta);
    return {"stroke_width" : stroke_width, 
            "speed" : line_speed, 
            "x" : -150, 
            "y" : Math.random() * canvas.height, 
            "width" : randomRange(MIN_LINE_WIDTH, MAX_LINE_WIDTH)};
}

function init_trail() {
    var trail = [];
    for(var i = 0; i < PLAYER_X; i++){
        trail[i] =  0;
    }

    return trail;

}

function update_trail(frame, player, trail) {
    trail[frame % PLAYER_X] = player.y + PLAYER_HEIGHT/2;
}