'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check for missing fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle string
    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation);
    }

    // Validate coordinate
    const rowLetter = coordinate[0].toUpperCase(); // Ensure uppercase for consistency
    const colNumber = coordinate.slice(1); // Extract the column number

    // Check if the coordinate is valid
    if (
      !/^[A-Ia-i]$/.test(rowLetter) || // Row must be A-I (case-insensitive)
      !/^[1-9]$/.test(colNumber) ||    // Column must be 1-9
      coordinate.length !== 2           // Coordinate must be exactly 2 characters
    ) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Convert coordinate to row and column indices
    const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0); // A=0, B=1, ..., I=8
    const col = parseInt(colNumber) - 1; // Convert to zero-based index

    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    // Check if the cell is already filled with the same value
    const currentIndex = row * 9 + col;
    if (puzzle[currentIndex] === value) {
      return res.json({ valid: true });
    }

    // Check for conflicts
    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflicts.push('row');
    }
    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflicts.push('column');
    }
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflicts.push('region');
    }

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    res.json({ valid: true });

  });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution });
    });
};