//Maintain state of pieces on the board
//Current state with board representation--> int for each piece, 0 for empty square
//gameBoard will refresh/update on each move to a new position

const gameBoard = {
  //Array to store piece positions
  pieces: new Array(numBoardSq);
  side: colors.white;
  //Account for the 50(100) move rule
  fiftyMove: 0;
  //Record the index of every half move
  halfMoves: 0;
  //The number of half moves in the search tree;
  ply: 0;
  //Permissions to castle
  // eg. 1101 --> white cannot castle queenside(wCQ: 2)
  // if (1101 & wCK) != 0 means white CAN castle kingside
  castlePerm: 0;
};
