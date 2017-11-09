//Need to hash out piece
//Update material[]
//pieceList[]
//pieceNum[]
const clearPiece = function (sq) {
  let piece = gameBoard.pieces[sq];
  let color = pieceCol[piece];
  //used to assign index of piece to be removed from pList
  let tempPieceNum = -1;

  //remove piece from position
  hashPiece(piece, sq);
  //set the square to empty
  gameBoard.pieces[sq] = pieces.empty;
  gameBoard.material[color] -= pieceVal[piece];
  //Remove piece from pList[];
  // sq = s3, set tpieceNum = 2
  // pList[wP 0] = s1;
  // pList[wP 1] = s2;
  // pList[wP 2] = s3;
  // pList[wP 3] = s4;
  // pList[wP 4] = s5;
  //loop through and swap 4 and 2
  for (let i = 0; i < gameBoard.pieceNum[piece]; i++) {
    //does the square equal the index of piece we are looking for ?
    if (gameBoard.pList[pieceIndex(piece, i) === sq]) {
      //Set tempPieceNum, and break
      tempPieceNum = i;
      break;
    };
  };

  //then reduce wP pieceNum --, so now only 4 pawns read, last index cant be reached
  gameBoard.pieceNum[piece]--;
  gameBoard.pList[pieceIndex(piece, tempPieceNum)] = gameBoard.pList[pieceIndex(piece, gameBoard.pieceNum[piece])];
};

//adding pieces

const addPiece = function (sq, piece) {
  let color = pieceCol[piece];

  hashPiece(piece, sq);
  //piece added to square
  gameBoard.pieces[sq] = piece;
  console.log("Piee on square" + sq "is now" + piece);
  //increase material[]
  gameBoard.material[col] += pieceVal[piece];
  //index the piece on the square in pList
  gameBoard.pList[pieceIndex(piece, gameBoard.pieceNum[piece])] = sq;
  //increase count of that piece
  gameBoard.pieceNum[piece]++;
};

//moving pieces
//update correct piece in piece list
const movePiece = function (from, to) {
    //the piece we want to moce
    let piece = gameBoard.pieces[from];

    //hash piece off square
    hashPiece(piece, from);
    gameBoard.pieces[from] = pieces.empty;

    //hash in piece to its new square
    hashPiece(piece, to);
    gameBoard.pieces[to] = piece;

    //CAUTION -->
    // if we move knight onto a square to capture a piece,
    //we need to remove the piece FIRST otherwise both pieces get removed

    //find piece in pList[] with piece index loop
    for (let i = 0; i < gameBoard.pieceNum[piece]; i++) {
      //if our piece on the index is at from, update it to toSq
      if (gameBoard.pList[pieceIndex(piece, i)]) {
        gameBoard.pList[pieceIndex(piece, i)] = to;
        console.log("New square is" + to);
      };
    };
};
