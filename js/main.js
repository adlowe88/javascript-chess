$(document).ready(function () {
  console.log("Main INIT");

});


//Initialize the board, ranks and files
const initBoard = function () {
  //Initialize the first square A1
  let sq = squares.A1;
  let rank = ranks.rank1;
  let file = files.fileA;


  //Loop 1 --> ALL squares in array, setting them to 100 (offBoard)
  for (let i = 0; i < numBoardSq; i++ ) {
    filesBoardArr[i] = squares.offBoard;
    ranksBoardArr[i] = squares.offBoard;
    // console.log(filesBoardArr);
  };


  //Loop2 --> ALL ranks then files (64 squares), set the files and ranks to the correct squares using the getSquare()

  for (rank = ranks.rank1; rank <= ranks.rank8; rank++) {
    // debugger;
    for (file = files.fileA; file <= files.fileH; file++) {
      //Set the square coordinate
      sq = getSquare(file, rank);
      //Sets the appropriate file and rank index ie. file 0-7 rank 0-7
      filesBoardArr[sq] = file;
      ranksBoardArr[sq] = rank;
    }
  }

  console.log(filesBoardArr[0]);
  console.log(ranksBoardArr[0]);
  console.log(filesBoardArr[squares.A1]);
  console.log(ranksBoardArr[squares.A1]);
  console.log(filesBoardArr[squares.E8]);
  console.log(ranksBoardArr[squares.E8]);
  console.log(filesBoardArr[squares.E5]);
  console.log(ranksBoardArr[squares.E5]);
  // for (rank = ranks.rank1; rank <= ranks.rank8; rank++) {
  //   for (file = files.fileA; file <= files.filesH; file++) {
  //
  //     sq = getSquare(file, rank);
  //
  //     filesBoardArr[sq] = file;
  //     ranksBoardArr[sq] = rank;
  //   };
  // };
};

// console.log(filesBoardArr[0]);
// console.log(filesBoardArr[squares.A1]);
// console.log(`${filesBoardArr[squares.A1]} ${ranksBoardArr[squares.A1]}`);
// console.log(`${filesBoardArr[squares.E4]} ${ranksBoardArr[squares.E4]}`);


//Initialization function

const init = function () {
  console.log("init called");
};

initBoard();
init();
