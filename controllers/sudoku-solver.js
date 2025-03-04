class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[row * 9 + i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      // Skip the current cell being checked
      if (i === row) continue;
  
      // Check if the value already exists in the column
      if (puzzleString[i * 9 + column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(startRow + i) * 9 + (startCol + j)] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) {
      return false; // Return false for invalid puzzles
    }
  
    const solveHelper = (puzzle) => {
      const index = puzzle.indexOf('.');
      if (index === -1) return puzzle;
  
      for (let num = 1; num <= 9; num++) {
        const numStr = num.toString();
        const row = Math.floor(index / 9);
        const col = index % 9;
  
        if (
          this.checkRowPlacement(puzzle, row, col, numStr) &&
          this.checkColPlacement(puzzle, row, col, numStr) &&
          this.checkRegionPlacement(puzzle, row, col, numStr)
        ) {
          const newPuzzle = puzzle.substring(0, index) + numStr + puzzle.substring(index + 1);
          const result = solveHelper(newPuzzle);
          if (result) return result;
        }
      }
      return false;
    };
  
    return solveHelper(puzzleString);
  }
}

module.exports = SudokuSolver;