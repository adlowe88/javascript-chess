//Maintain state of pieces on the board
//Current state with board representation--> int for each piece, 0 for empty square
//gameBoard will refresh/update on each move to a new position

const gameBoard = {
  //Array to store piece positions
  pieces: new Array(numBoardSq),
  side: colors.white,
  //Account for the 50(100) move rule
  fiftyMove: 0,
  //Record the index of every half move
  halfMoves: 0,
  //The number of half moves in the search tree;
  ply: 0,
  //Permissions to castle
  // eg. 1101 --> white cannot castle queenside(wCQ: 2)
  // if (1101 & wCK) != 0 means white CAN castle kingside
  castlePerm: 0,
  //en pasant squares
  enPasant: 0,
  //New array to store the current material value of each side
  material: new Array(2),
  //how many of each piece type
  pieceNum: new Array(13),
  //14 not 13 to give extra space just incase. See below
  pList: new Array(14 * 10),
  //Unique number representing each position by using randomNumber32bit()
  //What represents our unique position??
  //position key needs to represent both pieces you have and what squares they are on
  //account for two different knights etc..


  //need random numbers for EVERY combination of pieces, who's turn it is, castle permissions, en pasant squares
  //to get your position key ^= randomNumber generated for each of the conditions
  // eg.
  // piece1 = randomNumber32bit();
  // piece2 = randomNumber32bit();
  // piece3 = randomNumber32bit();
  // piece4 = randomNumber32bit();
  //
  // key ^= piece1;
  // key ^= piece2;
  // key ^= piece3;
  // key ^= piece4;

  //Then take key, starting as 0,and XOR in all the random numbers to represent the current position
  //key ^= piece1 will remove the piece from the board, and maintain key integrity
  //eg. if piece moves to capture something, still within the unique key, whilst removing the piece taken
  //repetition detection, draw 

  positionKey: 0,

};

//For a given piece, we want to know what square it is on
//PROBLEMS --> need to loop through 120 squares....a lot of empty squares
//the piece list allows us to if you have x pieces on the board, we are only going to make 8 searches in our array to find that piece
// piece list array [i] pieceListArr[]
//need to calculate the index to give the square  ie sqOfPiece = pieceListArr[i]
//need to store the max capacity of each piece ie promoting every pawn to knight = 10 knights
//wKn: 2 --> up to 10 max, so want to have enough possible places to store the 10 knights, so we never cross over indicies
//wKn * 10 + i --> 0 based index on pieceNum()
// for (i = 0; i < pieceNum[wKn]; i++) {
//   sq = pieceListArr[wKn * 10 + i]
// }
//therefore wKn occupy 20-29, wP 10- 19
const pieceIndex = function (piece, pieceNum) {
  return (piece * 10 + pieceNum);
};


//Piece lists pList[] - to generate moves
//Loop through board, find if there is a piece on the square and its on the relevant sides turn
// for pieces[],
// if (piece on sq === side to move)
// generate moves for piece on the square

//For a given piece, we want to know what square it is on
//PROBLEMS --> need to loop through 120 squares....a lot of empty squares
//the piece list allows us to if you have x pieces on the board, we are only going to make 8 searches in our array to find that piece
// piece list array [i] pieceListArr[]
//need to calculate the index to give the square  ie sqOfPiece = pieceListArr[i]
//need to store the max capacity of each piece ie promoting every pawn to knight = 10 knights
//wKn: 2 --> up to 10 max, so want to have enough possible places to store the 10 knights, so we never cross over indicies
//wKn * 10 + i --> 0 based index on pieceNum()
// for (i = 0; i < pieceNum[wKn]; i++) {
//   sq = pieceListArr[wKn * 10 + i]
// }
//therefore wKn occupy 20-29, wP 10- 19
