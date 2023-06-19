const { Tile, Grid, Game } = require('./game');

describe('Tile', () => {
  test('should store the letter on the tile', () => {
    const tile = new Tile('A');
    expect(tile.letter).toBe('A');
  });
});

describe('Grid', () => {
  let grid;

  beforeEach(() => {
    grid = new Grid();
  });

  test('should initialize a 5x5 grid of letter tiles', () => {
    expect(grid.tiles.length).toBe(5);
    expect(grid.tiles[0].length).toBe(5);
  });

  test('should shift a row of tiles in the specified direction', () => {
    // Set up a row with known letters
    grid.tiles[0] = [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E')];

    // Shift the row to the right
    grid.shiftRow(0, 'right');

    // Check if the row has been shifted correctly
    expect(grid.tiles[0].map(tile => tile.letter)).toEqual(['E', 'A', 'B', 'C', 'D']);
  });

  test('should shift a column of tiles in the specified direction', () => {
    // Set up a column with known letters
    grid.tiles.forEach((row, i) => {
      row[0] = new Tile(String.fromCharCode(65 + i));
    });

    // Shift the column down
    grid.shiftColumn(0, 'down');

    // Check if the column has been shifted correctly
    expect(grid.tiles.map(row => row[0].letter)).toEqual(['E', 'A', 'B', 'C', 'D']);
  });

  test('should check if each row or column forms a valid 5-letter word and highlight them if they do', () => {
    // Set up a grid with a valid word in the first row and first column
    // Assume a function isValidWord(word) that checks if a word is valid
    grid.tiles = [
      [new Tile('A'), new Tile('P'), new Tile('P'), new Tile('L'), new Tile('E')],
      [new Tile('P'), new Tile('X'), new Tile('X'), new Tile('X'), new Tile('X')],
      [new Tile('P'), new Tile('X'), new Tile('X'), new Tile('X'), new Tile('X')],
      [new Tile('L'), new Tile('X'), new Tile('X'), new Tile('X'), new Tile('X')],
      [new Tile('E'), new Tile('X'), new Tile('X'), new Tile('X'), new Tile('X')]
    ];

    grid.checkWords();

    // Check if the first row and first column are highlighted
    expect(grid.tiles[0][0].highlighted).toBe(true);
    expect(grid.tiles[1][0].highlighted).toBe(true);
  });

  test('should reset the grid with a new set of letters', () => {
    const initialTiles = JSON.parse(JSON.stringify(grid.tiles));
    grid.reset();
    expect(grid.tiles).not.toEqual(initialTiles);
  });
});

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('should initialize the game and set up event listeners for swipes', () => {
    // Assume a function setupEventListeners() that sets up the event listeners
    const spy = jest.spyOn(game, 'setupEventListeners');
    game.initialize();
    expect(spy).toHaveBeenCalled();
  });

  test('should update the game state and UI after each move', () => {
    // Assume a function updateUI() that updates the UI
    const spy = jest.spyOn(game, 'updateUI');
    game.update();
    expect(spy).toHaveBeenCalled();
  });

  test('should reset the game and update the UI', () => {
    // Assume a function updateUI() that updates the UI
    const spy = jest.spyOn(game, 'updateUI');
    game.reset();
    expect(spy).toHaveBeenCalled();
  });
});
