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
  // ply: 0,
  //Permissions to castle
  // eg. 1101 --> white cannot castle queenside(wCQ: 2)
  // if (1101 & wCK) != 0 means white CAN castle kingside
  castlePerm: 0,
  //en pasant squares set after pawn's first move
  enPasant: 0,
  //New array to store the current material value of each side
  material: new Array(2),
  //how many of each piece type ie 4 black pawns
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

  // moveList: new Array(maxDepth * maxPositionMoves);
  // movesScore: new Array(maxDepth * maxPositionMoves);
  // moveListStart: new Array(maxDepth);

};

//For a given piece, we want to know what square it is on
//PROBLEMS --> need to loop through 120 squares....a lot of empty squares
//the piece list allows us to if you have x pieces on the board, we are only going to make 8 searches in our array to find that piece
// piece list array [i] pieceListArr[]
//need to calculate the index to give the square  ie sqOfPiece = pieceListArr[i]

//need to store the max capacity of each piece ie promoting every pawn to knight = 10 knights
//wN: 2 --> up to 10 max, so want to have enough possible places to store the 10 knights, so we never cross over indicies
//wN * 10 + i --> 0 based index on pieceNum()

// for (i = 0; i < pieceNum[wN]; i++) {
//   sq = pieceListArr[wN * 10 + i]
// }
//therefore wN occupy 20-29, wP 10- 19
//pieceNum --> how many of that piece type
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
//wN: 2 --> up to 10 max, so want to have enough possible places to store the 10 knights, so we never cross over indicies
//wN * 10 + i --> 0 based index on pieceNum()
// for (i = 0; i < pieceNum[wN]; i++) {
//   sq = pieceListArr[wN * 10 + i]
// }
//therefore wN occupy 20-29, wP 10- 19




// Print board to console.

const printBoard = function () {
  let sq;
  let piece;
  // debugger;
  //Start loop at H8, then --
  for (let rank = ranks.rank8; rank >= ranks.rank1; rank--) {
    //Get the character for the rank (8 --> 1), and put some filler spaces
    let line = (rankChar[rank] + "  ");
    //loop through files
    for (let file = files.fileA; file <= files.fileH; file++) {
      //Get square
      sq = getSquare(file, rank);
      //Get piece on that square
      piece = gameBoard.pieces[sq];
      // console.log(gameBoard.pieces[sq]);
      //print piece indexing pieceChar[]
      line += (" " + pieceChar[piece] + " ");
    };
    console.log(line);
  };

    console.log("");
    //log empty line
    let line = "  ";
    for (file = files.fileA; file <= files.fileH; file++) {
      //Put files underneath pieces, so we can actually see rank and file notation
      line += (" " + fileChar[file] + " ");
    };
    console.log(line);

};



//Generate Hash key for a position
const generatePosKey = function () {
  let piece = pieces.empty;
  let fullKey = 0;
  //loop through all the squares 0 - 120
  for (let sq = 0; sq < numBoardSq; sq++) {
    //get a piece, and if piece is not empty, and not = 100 (offBoard)
    piece = gameBoard.pieces[sq];
    if (piece != pieces.empty && piece != squares.offBoard) {
      //if there is a piece, we will hash in the random key at position piece x 120 + square
      //XOR each piece type and its relevant square
      fullKey ^= pieceKeys[(piece * 120) + sq];
    };
  };

  //Hash in sideKeys
  if (gameBoard.sideKeys === colors.white) {
    fullKey ^= sideKeys;
  };

  //If enPasant square isnt noSq, (the square HAS been set in this position), hash it in
  //Cant use piece * 120, as would be 0 , so we just use the square itself
  if (gameBoard.enPasant != squares.noSq) {
    fullKey ^= pieceKeys[gameBoard.enPasant];
  };

  fullKey ^= castleKeys[gameBoard.castlePerm];

  return fullKey;
};

//eg. at start
//move to e4 --> rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1

const fenString = function (FEN) {
  // debugger;
  //Before you put in a position, we need to clear board, and all stored info
  resetBoard();
  //rank/file starting at A8
  let rank = ranks.rank8;
  let file = files.fileA;
  let piece = 0;
  let count = 0;
  let sq = 0;
  //Used to point to a particular character in the string
  //fen[fenCount]
  let fenCount = 0;
  //While loop to keep looping while rank is >= rank 1
  //every time we see / or a space in string, rank--
  // debugger;
  while ((rank >= ranks.rank1) && fenCount < FEN.length) {
    count = 1;
    //if the particular char is a piece letter or a number
    switch (FEN[fenCount]) {
      case "p":
        piece = pieces.bP;
        break;
      case "n":
        piece = pieces.bN;
        break;
      case "b":
        piece = pieces.bB;
        break;
      case "r":
        piece = pieces.bR;
        break;
      case "q":
        piece = pieces.bQ;
        break;
      case "k":
        piece = pieces.bK;
        break;
      case "P":
        piece = pieces.wP;
        break;
      case "N":
        piece = pieces.wN;
        break;
      case "B":
        piece = pieces.wB;
        break;
      case "R":
        piece = pieces.wR;
        break;
      case "Q":
        piece = pieces.wQ;
        break;
      case "K":
        piece = pieces.wK;
        break;

      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":

        piece = pieces.empty;
        //So if we see 4, we can set 4 empty cells...
        count = Number(FEN[fenCount])
        //FEN[fenCount].charCodeAt() - '0'.charCodeAt();
        break;

      case "/":
      case " ":
        rank--;
        //reset to leftmost file
        file = files.fileA;
        fenCount++;
        console.log(fenCount);
        // debugger;
        continue;

      default:
        console.log("FEN ERROR");
        return;
    };
    //if we haven't continued --> not at end of rank, but have found a piece or value
    //Using the count
      for (let i = 0; i < count; i++) {
        //getSquare
        sq = getSquare(file, rank);
        //set pieces[] to the current piece type
        gameBoard.pieces[sq] = piece;
        file++;
      };
    //Go to the next character in string
    fenCount++;
    console.log(fenCount);
  };

  //While loop ends at first space
  //Set who's turn
  //If you see w
  // debugger;
  if (FEN[fenCount] === "w") {
    gameBoard.side = colors.white;
    //Skip next space
    fenCount += 2;
  } else {
    gameBoard.side = colors.black;
    fenCount += 2;
  };

  //Castling permission
  //none = "-";
  for (let i = 0; i < 4; i++) {
    if (FEN[fenCount] === " ") {
      break;
    };

    switch (FEN[fenCount]) {
      //gameBoard.castlePerm | castleBits.wCQ = 2 (0000 | 0010 = )
      case "K":
        gameBoard.castlePerm |= castleBits.wCK;
        break;
      case "Q":
        gameBoard.castlePerm |= castleBits.wCQ;
        break;
      case "k":
        gameBoard.castlePerm |= castleBits.bCK;
        break;
      case "q":
        gameBoard.castlePerm |= castleBits.bCQ;
        break;

      default:
        break;

    };
    fenCount++;
  };
  fenCount++;

  //enPasant squares
  if (FEN[fenCount] != "-") {
    //get file
    //String.fromCharCode(); ??
    file = FEN[fenCount].charAt(); // - "a".charCodeAt();
    rank = Number(FEN[fenCount]); //FEN[fenCount + 1].charCodeAt() - "1".charCodeAt();
    console.log("FEN[fenCount]" + FEN[fenCount] + "File" + file + "Rank" + rank);
    //Set the enPasant square
    gameBoard.enPasant = getSquare(file, rank);;
  };

  //Generate position key
  gameBoard.posKey = generatePosKey();
  // updateMaterialList();
  console.log("FEN SUCSESS!");
  // debugger;
};

const isSqAttacked = function (sq, color) {
  let piece;
  let nextSq;

  //Who's turn is it?
  //What pieces are targeting this square?
  //White going up the board, black going down

  //Is this square being attacked by a pawn
  if (color === colors.white) {
    if (gameBoard.pieces[sq - 11] === pieces.wP || gameBoard.pieces[sq - 9] === pieces.wP) {
    console.log("WHITE PAWN!");
      return true;
    } else if (gameBoard.pieces[sq + 11] === pieces.bP || gameBoard.pieces[sq + 9] === pieces.bsP) {
      console.log("BLACK PAWN!");
      return true;
    };
  };

  //Define arrays for piece directions

  //Various knights directions (8)
  for (let i = 0; i < 8; i++) {
    piece = gameBoard.pieces[sq + nDir[i]];
    //On board, color is for the relevant side,
    if ((piece != squares.offBoard) && (pieceCol[piece] === color) && (knight[piece] === true)) {
      console.log("KNIGHT!");
      return true;
    };
  };

  //King directions (8)
  for (let i = 0; i < 8; i++) {
    piece = gameBoard.pieces[sq + kDir[i]];
    //On board, color is for the relevant side,
    if ((piece != squares.offBoard) && (pieceCol[piece] === color) && (king[piece] === true)) {
      return true;
    };
  };


  //Rook directions (4)
  for (let i = 0; i < 4; i++) {
    let dir = rDir[i];
    //first square we are going to iterate
    nextSq = sq + dir;
    //Get the piece at that square
    piece = gameBoard.pieces[nextSq];
    //Whilst still within board limits
    while (piece != squares.offBoard) {
      //Keep iterating until we encounter a piece
      if (piece != pieces.empty) {
        //Is the piece a rook or a queen and of the same color?
        if ((rookQueen[piece] === true) && pieceCol[piece] === color) {
          return true;
        };
        //Break while loop because we found another piece, and can't iterate further
        break;
      };
      //Otherwise increment nextSq in the current direction
      nextSq += dir;
    };
  };

  //Bishops directions (4)
  for (let i = 0; i < 4; i++) {
    let dir = bDir[i];
    //first square we are going to iterate
    nextSq = sq + dir;
    //Get the piece at that square
    piece = gameBoard.pieces[nextSq];
    //Whilst still within board limits
    while (piece != squares.offBoard) {
      //Keep iterating until we encounter a piece
      if (piece != pieces.empty) {
        //Is the piece a rook or a queen and of the same color?
        if ((bishopQueen[piece] === true) && pieceCol[piece] === color) {
          return true;
        };
        //Break while loop because we found another piece, and can't iterate further
        break;
      };
      //Otherwise increment nextSq in the current direction
      nextSq += dir;
    };
  };
  return false;
};

console.log(isSqAttacked(squares.C3, colors.white));
console.log(isSqAttacked(squares.D3, colors.white));
console.log(isSqAttacked(squares.C6, colors.black));


const resetBoard = function () {

	for(let i = 0; i < numBoardSq; ++i) {
		gameBoard.pieces[i] = squares.offBoard;
	}

  //Set internal board squares to have no pieces on it
	for(i = 21; i <= 98; i++) {
		gameBoard.pieces[i] = pieces.empty;
	}

	for(i = 0; i < 14 * 120; i++) {
		gameBoard.pList[i] = pieces.empty;
	}

	for(i = 0; i < 2; i++) {
		gameBoard.material[i] = 0;
	}

	for(i = 0; i < 13; i++) {
		gameBoard.pieceNum[i] = 0;
	}

	gameBoard.side = colors.both;
	gameBoard.enPasant = squares.noSq;
	gameBoard.fiftyMove = 0;
	// gameBoard.ply = 0;
	// gameBoard.hisPly = 0;
	gameBoard.castlePerm = 0;
	gameBoard.posKey = 0;
	// gameBoard.moveListStart[GameBoard.ply] = 0;

}

const updateMaterialList = function () {
  let piece;
  let color;

  // for (let rank = ranks.rank1; rank <= ranks.rank8; rank++) {
  //   for (let file = files.fileA; file <= files.fileH; file++) {
  //     sq = getSquare(file, rank);
  //   };
  // };

  for (let sq = 21; sq <= 98; i++) {
    //Get piece
    piece = gameBoard.pieces[sq];
    //If it's not empty
    if (piece != pieces.empty) {
      console.log(piece + sq);
      //Get the pieces color
      color = pieceCol[piece];
      //add the pieces value to material[] for that color
      gameBoard.material[color] += pieceVal[piece];
      //Take index of that piece and the current pieceNum and assign to sq
      gameBoard.pList[pieceIndex(piece, gameBoard.pieceNum[piece])] = sq;
      //Increment [piece] index
      gameBoard.pieceNum[piece]++;
    };
  };
};
//Material List
// Loop through the board,
// const materialList = function () {
//   let piece;
//   let sq;
//   let color;
//
//   for (let i = 0; i < 14 * 120; i++) {
//     gameBoard.pList[i] = pieces.empty;
//   };
//
//   for (let i = 0; i < 2; i++) {
//     gameBoard.material[i] = 0;
//   };
//
//   for (let i = 0; i < 13; i++) {
//     gameBoard.pieceNum[i] = 0;
//   };
//
//   for (let i = 21; i < 99; i++ ) {
//     //get piece, if it isnt empty, get its color so we can update piece value list
//     piece = gameBoard.pieces[sq];
//     if (piece != pieces.empty) {
//       // console.log(piece, sq);
//       color = pieceCol[piece];
//
//       gameBoard.material[color] += pieceVal[piece];
//       //Take piece index,
//       gameBoard.pList[pieceIndex(piece, gameBoard.pieceNum[piece])] = sq;
//       //increase index for next piece type
//       gameBoard.pieceNum[piece]++;
//     };
//   };
// };

// materialList();
