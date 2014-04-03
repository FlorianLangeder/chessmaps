var TILE_SIZE = 50;
var Color = {
    WHITE: 0,
    GREEN: 1,
    RED: 2,
    BLACK: 3
};

var Action = {
    Add: 1,
    Remove: 2,
    Move: 3,
    Walkable: 4,
    NotWalkable: 5
}

$(document).ready(function() {
    setFigureColor('White');
    stage = new Kinetic.Stage({container: 'canvas',width: 700,height: 700});
    var boardLayer = new Kinetic.Layer(); //background layer for the chessboard
    var labelLayer = new Kinetic.Layer(); //Layer to displayer tile name/coords
    var figureLayer = new Kinetic.Layer(); //layer for figures
    var tempLayer = new Kinetic.Layer(); //mouseover preview figure
    var tempTile = 0;
    var pieces = new Image();
    pieces.src = 'img/figures.png';
    var boardTiles = []; //Store Rects and Tile Coords to remove by index
    var figureList = []; //Stores Kinetic Image Objects
    var curTile = {'x':-1, 'y':-1};
    var curAction = Action.Add;
    var moveFigure = -1;
    var curFigure = 0;
    var curColor = 0;
    var mouseDown = false;

    var board = [[-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1]];

    drawBoard();

    function resizeBoard(height, oldHeight, width) {
        // expand to have the correct amount or rows
        for(var i = oldHeight; i < height; i++) {
            board.push([]);
        }

        for (var i = 0; i < height; i++) {
            for (var q = board[i].length; q < width; q++) {
                board[i].push(-1);
            }
        }
    }

    function removeOldImages(height, oldHeight, width, oldWidth) {
        for(var y = 0; y < oldHeight; y++) {
            for(var x = 0; x < oldWidth; x++) {
                if(y >= height || x >= width) {
                    if(isFigure(board[y][x])) {
                        removeFigure(x, y);
                    }
                }
            }
        }
    }

    function removeColorRedAndGreen() {
        for(var y = 0 ; y < board.length; y++){
            for(var x = 0 ; x < board[0].length; x++){
                if(isFigure(board[y][x])) {
                    if(board[y][x].color == Color.RED ||
                        board[y][x].color == Color.GREEN) {
                        removeFigure(x, y);
                    }
                } 
           }
        }
    }

    function draw(coord) {
        if(curAction == Action.Add) {
            if(board[coord.y][coord.x] != -2) {
                drawFigure(coord);
            }
        }
        else if(curAction == Action.Remove) {
            if(isFigure(board[coord.y][coord.x])){
                board[coord.y][coord.x].img.remove();
                board[coord.y][coord.x] = -1;
                figureLayer.draw();
            }
        }
        else if(curAction == Action.Move){
            if(isFigure(moveFigure)) {
                var pos = {"x":moveFigure.x, "y":moveFigure.y};
                curColor = moveFigure.color;
                curFigure = moveFigure.type;
                board[pos.y][pos.x].img.remove();
                board[pos.y][pos.x] = -1;
                drawFigure(coord);
                moveFigure = board[coord.y][coord.x];
            }
        }
        else if(curAction == Action.Walkable) {
            if(board[coord.y][coord.x] == -2) {
                board[coord.y][coord.x] = -1;
                drawTile(coord.x, coord.y, 1, true)
            }
        }
        else if(curAction == Action.NotWalkable) {
            if(isFigure(board[coord.y][coord.x])){
                board[coord.y][coord.x].img.remove();
            }
            drawTile(coord.x, coord.y, 0, true);
            board[coord.y][coord.x] = -2;
            figureLayer.draw();
        }
    }

    function drawFigure(coord) {
        var figureImage = new Kinetic.Image({
            x: coord.x * TILE_SIZE,
            y: coord.y * TILE_SIZE,
            image: pieces,
            width: TILE_SIZE,
            height: TILE_SIZE,
            crop: {x: curFigure * TILE_SIZE, y: curColor * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE}
        });
        if(isFigure(board[coord.y][coord.x])){
            board[coord.y][coord.x].img.remove(); 
        }
        board[coord.y][coord.x] = new Figure(curFigure,curColor, figureImage, coord.x, coord.y);
        if(curFigure == FigureType.KING) {
            removeOldKing(coord.x, coord.y, curColor);
        }
        figureLayer.add(figureImage);
        figureLayer.draw();
    }

    function removeFigure(x, y) {
        board[y][x].img.remove();
        board[y][x] = -1;
        figureLayer.draw();  
    }

    function removeOldKing(posX, posY, color) {
        for(var y = 0 ; y < board.length; y++){
            for(var x = 0 ; x < board[0].length; x++){
                if(isFigure(board[y][x])) {
                    if(board[y][x].type == FigureType.KING &&
                       board[y][x].color == color &&
                       (posX != x || posY != y)) {
                        removeFigure(x, y);
                    }
                }
            }
        }
    }

    function drawTempFigure(coord) {
        var tempFigureImage = new Kinetic.Image({
            x: coord.x * TILE_SIZE,
            y: coord.y * TILE_SIZE,
            opacity: 0.5,
            image: pieces,
            width: TILE_SIZE,
            height: TILE_SIZE,
            crop: {x: curFigure * TILE_SIZE, y: curColor * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE}
        });
        tempLayer.removeChildren();
        tempLayer.add(tempFigureImage);
        tempLayer.draw();
    }

    function drawBoard() {
        boardTiles.length = 0;
        stage.setHeight(board.length*TILE_SIZE);
        stage.setWidth(board[0].length*TILE_SIZE);
        boardLayer.removeChildren();
        labelLayer.removeChildren();
        for(var y = 0 ; y < board.length; y++){
            for(var x = 0 ; x < board[0].length; x++){
                var tilex = x * TILE_SIZE;
                var tiley = y * TILE_SIZE;
                var textX = numberToAlphabet(x);
                var textY = (board.length - y);

                if(board[y][x] == -2)
                    drawBoardRect(x, y, 0);
                else
                    drawBoardRect(x, y, 1);
            }   
        }
        stage.add(boardLayer);
        stage.add(labelLayer);
        stage.add(figureLayer);
        stage.add(tempLayer);
    }

    function drawBoardRect(x, y, opacity) {
        var tilex = x * TILE_SIZE;
        var tiley = y * TILE_SIZE;
        var textX = numberToAlphabet(x);
        var textY = (board.length - y);
        var rect = new Kinetic.Rect({
            x: tilex,
            y: tiley,
            width: TILE_SIZE,
            height: TILE_SIZE,
            fill: getBoardColor(x,y),
            opacity: opacity,
            stroke: 'black',
            strokeWidth: 1
        });
        boardLayer.add(rect); 

        var textLabel = new Kinetic.Text({
            x:tilex,
            y:tiley,
            text: ""+textX + textY,
            fontFamily: 'Calibri',
            opacity: opacity,
            fill: 'black'
        });             
        labelLayer.add(textLabel);

        boardTiles.push({'rect':rect, 'textLabel':textLabel});
    }

    function drawTile(x, y, opacity, draw) {
        var index = board[0].length * y + x;
        boardTiles[index].rect.opacity(opacity);
        boardTiles[index].textLabel.opacity(opacity);
        if(draw) {
            boardLayer.drawScene();
            labelLayer.drawScene();
        }
    }

    function isFigure(obj) {
        if(obj != -1 && obj != -2) return true;
        else return false;
    }

    function numberToAlphabet(n) {
        //97 = 'a'
        return String.fromCharCode(97 + n);
    }

    function getBoardColor(x, y) {
        return (x + y) % 2 === 0 ? '#FF6600': '#336699';
    }

    function getTileFromPosFloor(x, y) {
        var position = {
            'x': Math.floor(x / TILE_SIZE),
            'y': Math.floor(y / TILE_SIZE)
        };
        return position;
    }

    function updatePlayer(count) {
        $('#colorDropDown').children().remove();
        for(var i = 0; i < 4; i++) {
            if(i >= count) {
                $("#colorDropDown option[value='"+i+"']").remove();
                removeColorRedAndGreen();
            }
            else {
                $("#colorDropDown").append('<option value="'+i+'">'+intToColor(i)+'</option>');
            }
       }
       setFigureColor('White');
    }

    function setFigureColor(color){
        if(color == 'White') {
            setFigureImgAttribute('#0', 0, 0);
            setFigureImgAttribute('#1', 50, 0);
            setFigureImgAttribute('#2', 100, 0);
            setFigureImgAttribute('#3', 150, 0);
            setFigureImgAttribute('#4', 200, 0);
            setFigureImgAttribute('#5', 250, 0);
            curColor = Color.WHITE;
        } else if(color == 'Black') {
            setFigureImgAttribute('#0', 0, 150);
            setFigureImgAttribute('#1', 50, 150);
            setFigureImgAttribute('#2', 100, 150);
            setFigureImgAttribute('#3', 150, 150);
            setFigureImgAttribute('#4', 200, 150);
            setFigureImgAttribute('#5', 250, 150);
            curColor = Color.BLACK;
        } else if(color == 'Red') {
            setFigureImgAttribute('#0', 0, 100);
            setFigureImgAttribute('#1', 50, 100);
            setFigureImgAttribute('#2', 100, 100);
            setFigureImgAttribute('#3', 150, 100);
            setFigureImgAttribute('#4', 200, 100);
            setFigureImgAttribute('#5', 250, 100);
            curColor = Color.RED;
        } else if(color == 'Green') {
            setFigureImgAttribute('#0', 0, 50);
            setFigureImgAttribute('#1', 50, 50);
            setFigureImgAttribute('#2', 100, 50);
            setFigureImgAttribute('#3', 150, 50);
            setFigureImgAttribute('#4', 200, 50);
            setFigureImgAttribute('#5', 250, 50);
            curColor = Color.GREEN;
        }
    } 

    function setFigureImgAttribute(element, x, y) {
        $(element).css('marginLeft', -x + 'px');
        $(element).css('marginTop' , -y + 'px');
    }  

    function intToColor(i) {
        if(i == 0)
            return "White";
        else if(i == 1)
            return "Black";
        else if(i == 2)
            return "Red";
        else if(i == 3)
            return "Green";
    }

    $(document).ready(function() { 
    $("input[name='heightSpinner']").TouchSpin({
        min: 3,
        max: 26,
        boostat: 5
    });

    $("input[name='widthSpinner']").TouchSpin({
        min: 3,
        max: 26,
        boostat: 5
    });

    $("input[name='playerSpinner']").TouchSpin({
        min: 2,
        max: 4,
        step: 2
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

    $('#colorDropDown').change(function(){
        setFigureColor(intToColor($('#colorDropDown').val()));
    }); 

    $('#update').on('click',function(e){
        var height = $('#heightSpinner').val();
        var width = $('#widthSpinner').val();
        var playerCount = $('#playerSpinner').val();
        if(height < board.length || width < board[0].length) {
            removeOldImages(height, board.length, width, board[0].length);
            if(height < board.length) {
                var heightDif = board.length - height;
                board.splice(height,heightDif);
            }
            if(width < board[0].length) {
                var widthDif = board[0].length - width;
                for(var i = 0; i < height; i++) {
                    board[i].splice(width,widthDif);
                }
            }
            boardLayer.removeChildren();
            drawBoard();
        }
        if(width < board[0].length) {       
            boardLayer.removeChildren();
            drawBoard();
        }
        
        if(width > board[0].length || height > board.length) {
            var oldHeight = board.length;
            resizeBoard(height, oldHeight, width);
            boardLayer.removeChildren();
            drawBoard();
        }

        updatePlayer(playerCount);
    });

    $('#figureColorButton').on('click', function(e){
        var id = e.target.id;
        if(e.target.tagName !== "IMG")
            id = $(e.target).find('img').attr('id');
        curFigure = id;        
    });

    //add glowing border on click
    $('.actionBtn').on('click', function() {
        $('.actionBtn').each(function() {
            $(this).removeClass("glowBorder");
        });
        $(this).addClass("glowBorder");
    });

    //add glowing border on click
    $('.figureBtn').on('click', function() {
        $('.figureBtn').each(function() {
            $(this).removeClass("glowBorder");
        });
        $(this).addClass("glowBorder");
    });

    //Action Buttons
    $('#actionAdd').on('click', function() {
        curAction = Action.Add;
    });

    $('#actionRemove').on('click', function() {
        curAction = Action.Remove;
    });

    $('#actionMove').on('click', function() {
        curAction = Action.Move;
    });

    $('#actionClear').on('click', function() {
        for(var y = 0 ; y < board.length; y++){
            for(var x = 0 ; x < board[0].length; x++){
                drawTile(x, y, 1, false);
                if(isFigure(board[y][x])){
                    board[y][x].img.remove();
                }
                board[y][x] = -1;
            }
        }
        stage.draw();
    });

    $('#actionWalkable').on('click', function() {
        curAction = Action.Walkable;
    });

    $('#actionNotWalkable').on('click', function() {
        curAction = Action.NotWalkable;
    });

    $('#actionOpen').on('click', function() {

    });

    $('#actionUpload').on('click', function() {

    });

    //prevent spritesheet to show up on drag
    $('img').on('dragstart', function(event) {
        event.preventDefault(); 
    });

    stage.on('mouseover', function(e) {
        var mousePos = stage.getPointerPosition();
        var coord = getTileFromPosFloor(mousePos.x, mousePos.y);

        if(coord.x != curTile.x || coord.y != curTile.y) {
            curTile = coord;
            if(mouseDown) 
                draw(coord);
            else if(curAction == Action.Add){
                if(board[coord.y][coord.x] != -2) 
                    drawTempFigure(coord);     
                else {
                    tempLayer.removeChildren();
                    tempLayer.draw();
                }
            }
            else if(curAction == Action.Walkable) {
                if(board[coord.y][coord.x] == -2) {
                    //remove last tile again
                    if(tempTile != 0 && board[tempTile.y][tempTile.x] == -2) {
                        drawTile(tempTile.x, tempTile.y, 0, true);
                    }
                    tempTile = {'x':coord.x, 'y':coord.y};
                    drawTile(coord.x, coord.y, 0.75, true);
                }
                else {
                    if(tempTile != 0) {
                        if(board[tempTile.y][tempTile.x] == -2) {
                            drawTile(tempTile.x, tempTile.y, 0, true);
                        }
                    }
                }
            }
            else if(curAction == Action.NotWalkable) {
                if(board[coord.y][coord.x] != -2) {
                    //remove last tile again
                    if(tempTile != 0 && board[tempTile.y][tempTile.x] != -2) {
                        drawTile(tempTile.x, tempTile.y, 1, true);
                    }
                    tempTile = {'x':coord.x, 'y':coord.y};
                    drawTile(coord.x, coord.y, 0.25, true);
                }
                else {
                    if(tempTile != 0) {
                        if(board[tempTile.y][tempTile.x] != -2) {
                            drawTile(tempTile.x, tempTile.y, 1, true);
                        }
                    }
                }
            }
        }
    });

    stage.on('mouseleave', function() {
        curTile = {'x':-1, 'y': -1};
        tempLayer.removeChildren();
        tempLayer.draw();

        if(tempTile != 0) {
            if(curAction == Action.NotWalkable && board[tempTile.y][tempTile.x] != -2) {
                drawTile(tempTile.x, tempTile.y, 1, true);
                tempTile = 0;
            }
            else if(Action.Walkable && board[tempTile.y][tempTile.x] == -2) {
                drawTile(tempTile.x, tempTile.y, 0, true);
                tempTile = 0;
            }
        }
    });

   stage.on('mousedown', function() {
        mouseDown = true;
        var mousePos = stage.getPointerPosition();
        var coord = getTileFromPosFloor(mousePos.x, mousePos.y);
        curTile = coord;
        if(curAction == Action.Move) { 
            if(isFigure(board[coord.y][coord.x])) {
                moveFigure = board[coord.y][coord.x];
            } 
        }
        else {
            draw(coord); 
        }
    });

    stage.on('mouseup', function() {
        mouseDown = false;
        if(curAction == Action.Move) {
            moveFigure = -1;
        }
    });
});           
});