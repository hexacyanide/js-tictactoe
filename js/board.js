function Board() {
  this.turns = 0;
  this.players = {};
  this.tiles = [
    [], [], []
  ];
}

Board.prototype.registerPlayer = function(player, symbol) {
  this.players[symbol] = player;
};

Board.prototype.nextMove = function() {
  var symbol = (this.turns % 2 == 0) ? 'x' : 'o';
  
  var player = this.players[symbol];
  var pieces = this.countPieces();
  
  var pos = player.makeMove(this);
  this.setTile(pos[0], pos[1], symbol);
  
  if (this.countPieces() !== pieces + 1) {
    return console.log('Player ' + symbol + ' is cheating!');
  }
  
  var win = this.checkWin();
  if (win) {
    return console.log('Player ' + win + ' has won the game.');
  }
  
  this.turns++;
};

Board.prototype.countPieces = function() {
  var rows = [];
  for (var i = 0; i < 3; i++) rows.push(this.tiles[i].join(''));
  return rows.join('').length;
};

Board.prototype.getTile = function(x, y) {
  var symbol = this.tiles[x][y] || false;
  return symbol;
};

Board.prototype.setTile = function(x, y, symbol) {
  this.tiles[x][y] = symbol;
};

Board.prototype.reset = function() {
  this.turns = 0;
  this.tiles = [
    [], [], []
  ];
};

Board.prototype.getOpenSpaces = function() {
  var spaces = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (typeof this.tiles[i][j] === 'undefined')
      spaces.push([i, j]);
    }
  }
  
  return spaces;
};

Board.prototype.toString = function() {
  var rows = [];
  
  for (var i = 0; i < 3; i++) {
    var row = '|';
    for (var j = 0; j < 3; j++) {
      var symbol = this.getTile(i, j) || ' ';
      row += symbol + '|';
    }
    rows.push(row);
  }
  
  return rows.join('\n');
};

Board.prototype.checkWin = function() {
  var pattern = /^x{3}|o{3}$/;

  for (var i = 0; i < 3; i++) {
    var row = this.tiles[i].join('');
    var column = [
      this.tiles[0][i],
      this.tiles[1][i],
      this.tiles[2][i]
    ].join('');
    
    if (pattern.test(row)) return row[0];
    if (pattern.test(column)) return column[0];
  }
  
  var symbol = this.tiles[1][1];
  
  var r1 = this.tiles[0];
  var r3 = this.tiles[2];
  
  if (symbol == r1[0] && symbol == r3[2]) return symbol;
  if (symbol == r1[2] && symbol == r3[0]) return symbol;
  
  return false;
};
