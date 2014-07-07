function Player(symbol) {
  this.symbol = symbol;
  this.turns = 0;
}

Player.prototype.makeMove = function(board) {
  var spaces = board.getOpenSpaces();
  var pos = spaces[~~(Math.random() * spaces.length)];
  
  if (this.turns++ == 0) return [1, 2];
  if (this.turns++ == 2) return [1, 0];
  return pos;
};
