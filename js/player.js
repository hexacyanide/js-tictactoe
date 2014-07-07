function Player(symbol) {
  this.symbol = symbol;
}

Player.prototype.makeMove = function(board) {
  var spaces = board.getOpenSpaces();
  var pos = spaces[~~(Math.random() * spaces.length)];
  return pos
};
