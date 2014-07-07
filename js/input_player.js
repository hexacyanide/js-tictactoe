function InputPlayer(symbol) {
  this.symbol = symbol;
}

InputPlayer.prototype.makeMove = function(board) {
  var spaces = board.getOpenSpaces();
  if (spaces.length === 1) return spaces[0];

  var x = +prompt();
  var y = +prompt();

  for (var i = 0; i < spaces.length; i++) {
    var space = spaces[i];
    if (x === space[0] && y === space[1]) return [x, y];
  }
};
