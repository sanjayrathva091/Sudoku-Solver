const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const solver = new SudokuSolver();

suite('Unit Tests', () => {
  // Test 1: Logic handles a valid puzzle string of 81 characters
  test('1. Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isTrue(solver.validate(puzzle) === true);
  });

  // Test 2: Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('2. Logic handles a puzzle string with invalid characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a'; // Contains 'a'
    assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' });
  });

  // Test 3: Logic handles a puzzle string that is not 81 characters in length
  test('3. Logic handles a puzzle string that is not 81 characters long', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 characters
    assert.deepEqual(solver.validate(puzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  // Test 4: Logic handles a valid row placement
  test('4. Logic handles a valid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3')); // Row 0, Column 1, Value 3
  });

  // Test 5: Logic handles an invalid row placement
  test('5. Logic handles an invalid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1')); // Row 0, Column 1, Value 1 (conflict)
  });

  // Test 6: Logic handles a valid column placement
  test('6. Logic handles a valid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3')); // Row 0, Column 1, Value 3
  });

  // Test 7: Logic handles an invalid column placement
  test('7. Logic handles an invalid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '5')); // Row 0, Column 1, Value 5 (conflict)
  });

  // Test 8: Logic handles a valid region (3x3 grid) placement
  test('8. Logic handles a valid region placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '3')); // Row 0, Column 1, Value 3
  });

  // Test 9: Logic handles an invalid region (3x3 grid) placement
  test('9. Logic handles an invalid region placement', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '1')); // Row 0, Column 1, Value 1 (conflict)
  });

  // Test 10: Valid puzzle strings pass the solver
  test('10. Valid puzzle strings pass the solver', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Valid puzzle string
    const solution = puzzlesAndSolutions[0][1]; // Valid solution
    assert.isString(solver.solve(puzzle));
    assert.equal(solver.solve(puzzle), solution);
  });

  // Test 11: Invalid puzzle strings fail the solver
  test('11. Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a'; // Invalid puzzle string
    assert.isFalse(solver.solve(puzzle));
  });

  // Test 12: Solver returns the expected solution for an incomplete puzzle
  test('12. Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = puzzlesAndSolutions[0][0]; // Incomplete puzzle string
    const solution = puzzlesAndSolutions[0][1]; // Expected solution
    assert.equal(solver.solve(puzzle), solution);
  });
});