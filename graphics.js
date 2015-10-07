var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var AVATAR_COLOR = "#3DB845";
var block_color = "#00A3FB";
var BOOST_COLOR = "#BF4040";
var HIGHLIGHT_COLOR = "#FFCF70";
var BLOCK_HEIGHT = 40;

function draw_scene() {
    context.clearRect(0,0, canvas.width, canvas.height);
}

function draw_avatar(player) {
    context.beginPath();
    context.rect(PLAYER_X , player.y , PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillStyle = AVATAR_COLOR;
    context.fill();
    context.closePath();
}

function draw_boost(player) {
    // Styling was a bit of an accident, but hey, I like it.
    // a - - - b
    //   - - -
    //   c - d 
    //     e
    if(player.vy < 0){
        var path = new Path2D();
        var a = {'x': PLAYER_X, 'y': player.y + PLAYER_HEIGHT};
        var b = {'x': PLAYER_X + PLAYER_WIDTH, 'y': player.y + PLAYER_HEIGHT};
        var c = {'x': PLAYER_X + Math.floor(PLAYER_WIDTH/4), 'y': player.y + PLAYER_HEIGHT + 7};
        var d = {'x': PLAYER_X + Math.floor(PLAYER_WIDTH*(3/4)), 'y': player.y + PLAYER_HEIGHT + 7};
        var e = {'x': PLAYER_X + Math.floor(PLAYER_WIDTH/2), 'y': player.y + PLAYER_HEIGHT + 10};
        context.beginPath();

        // body
        path.moveTo(a.x, a.y);
        path.lineTo(b.x, b.y);
        path.lineTo(d.x, d.y);
        path.lineTo(c.x, c.y);
        path.lineTo(a.x, a.y);
        context.fillStyle = BOOST_COLOR;
        context.fill(path);

        // tip
        path.moveTo(c.x, c.y);
        path.lineTo(e.x, e.y);
        path.lineTo(d.x, d.y);
        path.lineTo(c.x, c.y);
        context.fillStyle = HIGHLIGHT_COLOR;
        context.fill(path);

        context.closePath();
    }
}

function draw_blocks(blocks){
    for (var i = 0; i < blocks.length; i++) {
    	var block = blocks[i];
        context.beginPath();
        context.rect(block.x, block.y , block.width, BLOCK_HEIGHT);
        context.fillStyle = block_color;
        context.fill();
        context.closePath();
    }
}

function draw_score(score) {
    context.fillStyle = AVATAR_COLOR;
    context.font = "30px Arial";
    context.textAlign = "right";
    context.fillText(score, canvas.width, 30);
}

function draw_end_scene(score) {
    context.fillStyle = "#000000";

    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText(score, canvas.width/2, canvas.height/2);

    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Press space to continue", canvas.width/2, canvas.height/2 + 30);
}
