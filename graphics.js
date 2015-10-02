var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var avatar_color = "#EBE395";
var block_color = "#08576B";
var BRICK_HEIGHT = 100;

function draw_scene() {
    context.clearRect(0,0, canvas.width, canvas.height);

}

function draw_avatar(player) {
    context.beginPath();
    context.rect(30, player.y , PLAYER_HEIGHT, PLAYER_WIDTH);
    context.fillStyle = avatar_color;
    context.fill();
    context.closePath();
}

function draw_bricks(bricks){
 	console.log(bricks);

    for (var brick in bricks) {
    	console.log(brick);
        context.beginPath();
        context.rect(brick.x, brick.y , brick.width, BRICK_HEIGHT);
        context.fillStyle = block_color;
        context.fill();
        context.closePath();
    }
}