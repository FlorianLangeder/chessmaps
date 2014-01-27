var TILE_SIZE = 50;
$(document).ready(function() {

    stage = new Kinetic.Stage({container: 'canvas',width: 700,height: 700});
    boardLayer = new Kinetic.Layer(); //background layer for the chessboard
    figureLayer = new Kinetic.Layer(); //layer for figures

    board = [[-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1],
             [-1,-1,-1,-1,-1,-1,-1,-1]];
    
    drawBoard();


	$("input[name='heightSpinner']").TouchSpin({
        min: 1,
        max: 30,
        boostat: 5
	});

	$("input[name='widthSpinner']").TouchSpin({
        min: 1,
        max: 30,
        boostat: 5
	});

	$("input[name='playerSpinner']").TouchSpin({
        min: 1,
        max: 10
	});

    $('.mouseFollow div').powerTip({ followMouse: true });

    $('input').bind('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
           event.preventDefault();
           return false;
        }
    });

    $('#colorDropDown').change( function(){
        changeFigureColor($('#colorDropDown').val());
    }); 

    $('#update').on('click',function(e){
        var height = $('#heightSpinner').val();
        var width = $('#widthSpinner').val();
        if(width < board.length) {
            var dif = board.length - width;
            board.splice(width,dif);
            boardLayer.removeChildren();
            drawBoard();
        }
        else if(width > board.length) {
            var dif = width - board.length;
            for(var i = 0; i < dif; i++) {
                board.push('-1');
            }
            boardLayer.removeChildren();
            drawBoard();
        }

        if(height < board[0].length) {
            var dif = board[0].length - height;
            board[0].splice(height,dif);
            boardLayer.removeChildren();
            drawBoard();
        }
        else if(height > board[0].length) {
            var dif = height - board[0].length;
            for(var i = 0; i < dif; i++) {
                board[0].push('-1');
            }
            boardLayer.removeChildren();
            drawBoard();
        }
    });

    $('.figureButton').on('click',function(e){
        id = e.target.src;
        alert(id);
    });

    function drawBoard() {
           console.log(board.length);
        for(var y = 0 ; y < board.length; y++){
            for(var x = 0 ; x < board[0].length; x++){
                var tilex = x * TILE_SIZE;
                var tiley = y * TILE_SIZE;
                var rect = new Kinetic.Rect({
                    x: tilex,
                    y: tiley,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    fill: getBoardColor(x,y),
                    stroke: 'black',
                    strokeWidth: 1
                });
                boardLayer.add(rect);   
            }
        }
        stage.add(boardLayer);
        stage.add(figureLayer);
    }

    function getBoardColor(x, y) {
        return (x + y) % 2 === 0 ? '#FF6600': '#336699';
    }

    function changeFigureColor(color){
        if(color == 'White') {
            $('#pawnImg').attr("src","img/wPawn.png");
            $('#knightImg').attr("src","img/wKnight.png");
            $('#bishopImg').attr("src","img/wBishop.png");
            $('#rookImg').attr("src","img/wRook.png");
            $('#queenImg').attr("src","img/wQueen.png");
            $('#kingImg').attr("src","img/wKing.png");
        } else if(color == 'Black') {
            $('#pawnImg').attr("src","img/bPawn.png");
            $('#knightImg').attr("src","img/bKnight.png");
            $('#bishopImg').attr("src","img/bBishop.png");
            $('#rookImg').attr("src","img/bRook.png");
            $('#queenImg').attr("src","img/bQueen.png");
            $('#kingImg').attr("src","img/bKing.png");
        } else if(color == 'Red') {
            $('#pawnImg').attr("src","img/rPawn.png");
            $('#knightImg').attr("src","img/rKnight.png");
            $('#bishopImg').attr("src","img/rBishop.png");
            $('#rookImg').attr("src","img/rRook.png");
            $('#queenImg').attr("src","img/rQueen.png");
            $('#kingImg').attr("src","img/rKing.png");
        } else if(color == 'Green') {
            $('#pawnImg').attr("src","img/gPawn.png");
            $('#knightImg').attr("src","img/gKnight.png");
            $('#bishopImg').attr("src","img/gBishop.png");
            $('#rookImg').attr("src","img/gRook.png");
            $('#queenImg').attr("src","img/gQueen.png");
            $('#kingImg').attr("src","img/gKing.png");
        }
    }                 
});

