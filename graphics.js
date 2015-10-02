var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var AVATAR_COLOR = "#3DB845";
var block_color = "#00A3FB";
var BLOCK_HEIGHT = 40;

function draw_scene() {
    context.clearRect(0,0, canvas.width, canvas.height);
}

function draw_avatar(player) {
    context.beginPath();
    context.rect(30, player.y , PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillStyle = AVATAR_COLOR;
    context.fill();
    context.closePath();
}

function draw_bricks(bricks){
    for (var i = 0; i < bricks.length; i++) {
    	var brick = bricks[i];

        context.beginPath();
        context.rect(brick.x, brick.y , brick.width, BLOCK_HEIGHT);
        context.fillStyle = block_color;
        context.fill();
        context.closePath();
    }
}