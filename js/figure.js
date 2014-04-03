var FigureType = {
    PAWN: 0,
    KNIGHT: 1,
    BISHOP: 2,
    QUEEN: 3,
    KING: 4,
    ROOK: 5
};

var Figure = function(type, color, img, x, y){
    this.type = type;
    this.color = color;
    this.img = img;
    this.x = x;
    this.y = y;
};