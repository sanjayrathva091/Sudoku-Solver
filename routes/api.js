'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation);
    }

    const row = coordinate.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const col = parseInt(coordinate[1]) - 1;

    if (isNaN(col) || row < 0 || row >= 9 || col < 0 || col >= 9) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

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