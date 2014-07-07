function IntelligentPlayer(symbol) {
  this.symbol = symbol;
  this.board = null;
  this.turns = 0;
}

IntelligentPlayer.prototype.makeMove = function(board) {
  this.board = board;
  this.incrementTurns();
  
  var win, block;
  if (win = this.attemptWin(board)) return win;
  if (block = this.attemptBlock(board)) return block;
  
  var board = this.getLegacyBoard();
  
  if (this.turns == 1) return this.fillRandomCorner();
  if (this.turns == 3) {
    var corner = this.getOwnCorner();
    var opposite = (corner + 2) % 4;
    
    if (this.checkCorner(opposite)) return this.playCorner(opposite);
    else return this.playCenter(board);
  }
  
  if (this.turns == 5 && this.countCorners() == 2) {
    var rem = this.remainingCorners();
    if (this.cornersAreOpposing() && rem > 0) {
      if (rem == 1) return this.playLastCorner();
      if (rem == 2) return this.playRandomCorner();
    }
  }
  
  if (this.turns == 2) {
    if (this.checkEdges() || this.checkCorners()) return this.playCenter();
    if (this.checkCenter()) return this.fillRandomCorner();
  }
  
  if (this.turns == 4) {
    if (board[0] == board[8] && board[0] != ' ') return this.playRandomEdge();
    if (board[2] == board[6] && board[2] != ' ') return this.playRandomEdge();
    if (board[1] == board[5] && board[1] != ' ') return [0, 2];
    if (board[5] == board[7] && board[5] != ' ') return [2, 2];
    if (board[7] == board[3] && board[7] != ' ') return [2, 0];
    if (board[3] == board[1] && board[3] != ' ') return [0, 0];
    if (board[3] == board[2] && board[3] != ' ') return [0, 0];
    if (board[1] == board[8] && board[1] != ' ') return [0, 2];
    if (board[5] == board[6] && board[5] != ' ') return [2, 2];
    if (board[7] == board[0] && board[7] != ' ') return [2, 0];
    if (board[7] == board[2] && board[7] != ' ') return [2, 2];
    if (board[5] == board[0] && board[5] != ' ') return [0, 2];
    if (board[1] == board[6] && board[1] != ' ') return [0, 0]
    if (board[3] == board[8] && board[3] != ' ') return [2, 0];
    
    if (this.getOwnCorner() !== -1) {
      if (this.checkCenter()) return this.playRandomCorner();
      if (!this.checkCenter()) return this.playCenter();
    }
    
    return this.playRandomEdge();
  }
  
  return this.playRandomOpen();
};

IntelligentPlayer.prototype.attemptWin = function() {
  var board = this.getLegacyBoard();

  var n, b;
  for (var r = 0; r < 3; r++) {
    n = 0;
    b = 0;
    var s = r * 3;
    for (var i = s; i < s + 3; i++) {
      if (board[i] == this.symbol) n++;
      if (board[i] == ' ') b++;
    }
        	
    if (n == 2 && b == 1) {
      // System.out.println("completing row: " + r);
      return this.completeRow(r);
    }
  }
    	
  for (var c = 0; c < 3; c++) {
    n = 0;
    b = 0;
    for (var i = c; i < c + 7; i += 3) {
      if (board[i] == this.symbol) n++;
      if (board[i] == ' ') b++;
    }
        	
    if (n == 2 && b == 1) {
      // System.out.println("completing column: " + c);
      return this.completeColumn(c);
    }
  }
    	
  n = 0;
  b = 0;
  for (var i = 0; i < 9; i += 4) {
    if (board[i] == this.symbol) n++;
    if (board[i] == ' ') b++;
  }
    	
  if (n == 2 && b == 1) {
    if (board[0] == ' ') return [0, 0];
    if (board[4] == ' ') return [1, 1];
    if (board[8] == ' ') return [2, 2];
  }
    	
  n = 0;
  b = 0;
  for (var i = 2; i < 7; i += 2) {
    if (board[i] == this.symbol) n++;
    if (board[i] == ' ') b++;
  }
    	
  if (n == 2 && b == 1) {
    if (board[2] == ' ') return [0, 2];
    if (board[4] == ' ') return [1, 1];
    if (board[6] == ' ') return [2, 0];
  }

  return false;
};

IntelligentPlayer.prototype.attemptBlock = function() {
  var board = this.getLegacyBoard();
  var opp = (this.symbol == 'x') ? 'o' : 'x';
  
  var n, b;
  for (var r = 0; r < 3; r++) {
    n = 0;
    b = 0;
    var s = r * 3;
    for (var i = s; i < s + 3; i++) {
    	if (board[i] == opp) n++;
    	if (board[i] == ' ') b++;
    }
    
    // System.out.println("row: " + r + " has n=" + n + " and b=" + b);
    if (n == 2 && b == 1) {
    	// System.out.println("performing block on row: " + r);
    	return this.completeRow(r);
    }
  }

  for (var c = 0; c < 3; c++) {
    n = 0;
    b = 0;
    for (var i = c; i < c + 7; i += 3) {
    	if (board[i] == opp) n++;
    	if (board[i] == ' ') b++;
    }
    
    // System.out.println("col: " + c + " has n=" + n + " and b=" + b);
    if (n == 2 && b == 1) {
    	// System.out.println("performing block on col: " + c);
    	return this.completeColumn(c);
    }
  }

  n = 0;
  b = 0;
  for (var i = 0; i < 9; i += 4) {
    if (board[i] == opp) n++;
    if (board[i] == ' ') b++;
  }

  if (n == 2 && b == 1) {
    if (board[0] == ' ') return [0, 0];
    if (board[4] == ' ') return [1, 1];
    if (board[8] == ' ') return [2, 2];
  }

  n = 0;
  b = 0;
  for (var i = 2; i < 7; i += 2) {
    if (board[i] == opp) n++;
    if (board[i] == ' ') b++;
  }

  if (n == 2 && b == 1) {
    if (board[2] == ' ') return [0, 2];
    if (board[4] == ' ') return [1, 1];
    if (board[6] == ' ') return [2, 0];
  }

  return false;
};

IntelligentPlayer.prototype.getLegacyBoard = function() {
  var board = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      board.push(this.board.getTile(i, j) || ' ');
    }
  }
  return board;
};

IntelligentPlayer.prototype.completeRow = function(row) {
  if (!this.board.getTile(row, 0)) return [row, 0];
  if (!this.board.getTile(row, 1)) return [row, 1];
  if (!this.board.getTile(row, 2)) return [row, 2];
};

IntelligentPlayer.prototype.completeColumn = function(column) {
  if (!this.board.getTile(0, column)) return [0, column];
  if (!this.board.getTile(1, column)) return [1, column];
  if (!this.board.getTile(2, column)) return [2, column];
};

IntelligentPlayer.prototype.incrementTurns = function() {
  if (this.turns != 0) {
    this.turns += 2;
    return;
  }
        
  if (this.symbol == 'x') this.turns = 1;
  if (this.symbol == 'o') this.turns = 2;
};

IntelligentPlayer.prototype.checkCenter = function() {
  return !!this.board.getTile(1, 1);
};
    
IntelligentPlayer.prototype.checkCorner = function(i) {
  if (i === 0) return !!this.getTile(0, 0);
  if (i === 1) return !!this.getTile(0, 2);
  if (i === 2) return !!this.getTile(2, 0);
  if (i === 3) return !!this.getTile(2, 2);
  return false;
};
    
IntelligentPlayer.prototype.checkCorners = function() {
  return !!this.board.getTile(0, 0) || !!this.board.getTile(0, 2)
      || !!this.board.getTile(2, 0) || !!this.board.getTile(2, 2);
};
    
IntelligentPlayer.prototype.checkEdge = function(i) {
  if (i === 0) return !!this.board.getTile(0, 1);
  if (i === 1) return !!this.board.getTile(2, 1);
  if (i === 2) return !!this.board.getTile(1, 0);
  if (i === 3) return !!this.board.getTile(1, 2);
  return false;
};
    
IntelligentPlayer.prototype.checkEdges = function() {
  return !!this.board.getTile(0, 1) || !!this.board.getTile(2, 1)
      || !!this.board.getTile(1, 0) || !!this.board.getTile(1, 2);
};
    
IntelligentPlayer.prototype.playCenter = function() {
  return [1, 1];
};
    
IntelligentPlayer.prototype.playEdge = function(i) {
  if (i === 0) return [0, 1];
  if (i === 1) return [1, 2];
  if (i === 2) return [2, 1];
  if (i === 3) return [1, 0];
};
    
IntelligentPlayer.prototype.playCorner = function(i) {
  if (i === 0) return [0, 0];
  if (i === 1) return [0, 2];
  if (i === 2) return [2, 2];
  if (i === 3) return [2, 0];
};

IntelligentPlayer.prototype.getOwnCorner = function() {
  if (this.board.getTile(0, 0) == this.symbol) return 0;
  if (this.board.getTile(0, 2) == this.symbol) return 1;
  if (this.board.getTile(2, 0) == this.symbol) return 2;
  if (this.board.getTile(2, 2) == this.symbol) return 3;
  return -1;
};

IntelligentPlayer.prototype.cornersAreOpposing = function() {
  var corner = this.getOwnCorner();
  var opposite = (corner + 2) % 4;
  return !this.checkCorner(corner) && !this.checkCorner(opposite);
};

IntelligentPlayer.prototype.countCorners = function() {
  var i = 0;
  if (this.board.getTile(0, 0) === this.symbol) i++;
  if (this.board.getTile(0, 2) === this.symbol) i++;
  if (this.board.getTile(2, 0) === this.symbol) i++;
  if (this.board.getTile(2, 2) === this.symbol) i++;
  return i;
};

IntelligentPlayer.prototype.remainingCorners = function() {
  var i = 0;
  if (this.board.getTile(0, 0) === ' ') i++;
  if (this.board.getTile(0, 2) === ' ') i++;
  if (this.board.getTile(2, 0) === ' ') i++;
  if (this.board.getTile(2, 2) === ' ') i++;
  return i;
};

IntelligentPlayer.prototype.randomPair = function() {
  return [~~(Math.random() * 3), ~~(Math.random() * 3)];
};

IntelligentPlayer.prototype.playLastCorner = function() {
  if (this.remainingCorners() == 1) {
    if (!this.board.getTile(0, 0)) return [0, 0];
    if (!this.board.getTile(0, 2)) return [0, 2];
    if (!this.board.getTile(2, 0)) return [2, 0];
    if (!this.board.getTile(2, 2)) return [2, 2];
  }
};

IntelligentPlayer.prototype.playRandomCorner = function() {
  var r = ~~(Math.random() * 4);
  while (!this.checkCorner(r)) r = ~~(Math.random() * 4);
  return this.playCorner(r);
};

IntelligentPlayer.prototype.playRandomEdge = function() {
  var r = ~~(Math.random() * 4);
  while (!this.checkEdge(r)) r = ~~(Math.random() * 4);
  return this.playEdge(r);
};

IntelligentPlayer.prototype.playRandomOpen = function() {
  var r = this.randomPair();
  while (!this.board.getTile(r[0], r[1])) r = this.randomPair();
  return r;
};

IntelligentPlayer.prototype.fillRandomCorner = function() {
  var n = ~~(Math.random() * 4);
  var corners = [
    [0, 0], [0, 2], [2, 0], [2, 2]
  ];
  
  return corners[n];
};
