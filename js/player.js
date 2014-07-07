function Player(symbol) {
  this.symbol = symbol;
  this.turns = 0;
}

Player.prototype.makeMove = function(board) {
  var spaces = board.getOpenSpaces();
  var pos = spaces[~~(Math.random() * spaces.length)];
  return pos;
};
