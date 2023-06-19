class Tile {
  constructor(letter) {
    this.letter = letter;
    this.highlighted = false;
    this.doubleHighlighted = false;
    this.animate = false;
    this.animationDirection = '';  // 'up', 'down', 'left', or 'right'
    this.fadeIn = false;
    this.fadeOut = false;
  }
}

class Grid {
  constructor(wordList, letters) {
    this.wordList = wordList;
    this.tiles = this.generateTiles(letters);
  }

  generateTiles(letters) {
    const tiles = [];

    let lettersArray = letters.split('');
    lettersArray.sort(() => Math.random() - 0.5);
    letters = lettersArray.join('');

    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const letter = letters.charAt(i*5 + j);
        row.push(new Tile(letter));
      }
      tiles.push(row);
    }

    return tiles;
  }

  shiftColumn(column, direction) {
    let columnTiles = this.tiles.map(row => row[column]);
  
    if (direction === 'up') {
      const firstTile = columnTiles.shift();
      firstTile.fadeIn = true;
      columnTiles.push(firstTile);
    } else if (direction === 'down') {
      const lastTile = columnTiles.pop();
      lastTile.fadeIn = true;
      columnTiles.unshift(lastTile);
    }
  
    // Set the animate property on all Tiles in the column
    columnTiles.forEach(tile => {
      tile.animate = true;
      tile.animationDirection = direction;
    });
  
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i][column] = columnTiles[i];
    }
  }
  
  shiftRow(row, direction, tiles = this.tiles) {
    if (direction === 'left') {
      const firstTile = tiles[row].shift();
      firstTile.fadeIn = true;
      tiles[row].push(firstTile);
    } else if (direction === 'right') {
      const lastTile = tiles[row].pop();
      lastTile.fadeIn = true;
      tiles[row].unshift(lastTile);
    }
  
    // Set the animate property on all Tiles in the row
    tiles[row].forEach(tile => {
      tile.animate = true;
      tile.animationDirection = direction;
    });

  }
  
  
  isValidWord(word) {
    return this.wordList.includes(word.toLowerCase()) || this.wordList.includes(word.toUpperCase());
  }
  
  checkWords() {
    // Initialize a grid of the same dimensions as this.tiles
    let highlightCount = [];
    for (let i = 0; i < 5; i++) {
      highlightCount.push(new Array(5).fill(0));
    }
  
    // Reset all highlights
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.tiles[i][j].highlighted = false;
        this.tiles[i][j].doubleHighlighted = false;
      }
    }
  
    for (let i = 0; i < 5; i++) {
      const rowWord = this.tiles[i].map(tile => tile.letter).join('');
      const columnWord = this.tiles.map(row => row[i].letter).join('');
  
      if (this.isValidWord(rowWord)) {
        for (let j = 0; j < 5; j++) {
          highlightCount[i][j] += 1;
        }
      }
      
      if (this.isValidWord(columnWord)) {
        for (let j = 0; j < 5; j++) {
          highlightCount[j][i] += 1;
        }
      }
    }
  
    let score = 0;
  
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (highlightCount[i][j] > 1) {
          this.tiles[i][j].highlighted = true;
          this.tiles[i][j].doubleHighlighted = true;
          score += 2; // Add 2 points for double highlighted tiles
        } else if (highlightCount[i][j] === 1) {
          this.tiles[i][j].highlighted = true;
          score += 1; // Add 1 point for highlighted tiles
        } else {
          this.tiles[i][j].highlighted = false;
          this.tiles[i][j].doubleHighlighted = false;
        }
      }
    }
  
    return score;
  }
  


  
  

  reset() {
    const directions = ['up', 'down', 'left', 'right'];
    const types = ['row', 'column'];

    for (let i = 0; i < 35; i++) {
      let type, index, direction;

      type = types[Math.floor(Math.random() * types.length)];
      index = Math.floor(Math.random() * 5);
      direction = directions[Math.floor(Math.random() * directions.length)];

      if (type === 'row') {
        this.shiftRow(index, direction);
      } else if (type === 'column') {
        this.shiftColumn(index, direction);
      }
    }
  }


}

class Game {
  constructor() {
    this.score = 0;
  }

  async initialize() {

    document.body.style.backgroundColor = this.getRandomColor();

    await this.loadWordList();
    await this.loadPuzzles();
  
    const puzzleKeys = Object.keys(this.puzzles);
    const randomKey = puzzleKeys[Math.floor(Math.random() * puzzleKeys.length)];
    this.grid = new Grid(this.wordList, this.puzzles[randomKey]);
  
    this.setupEventListeners();
    this.update();

  }

  getRandomColor() {

    const namedColors = {
      "AliceBlue": "#F0F8FF",
      "AntiqueWhite": "#FAEBD7",
      "Aqua": "#00FFFF",
      "Aquamarine": "#7FFFD4",
      "Azure": "#F0FFFF",
      "Beige": "#F5F5DC",
      "Bisque": "#FFE4C4",
      "Black": "#000000",
      "BlanchedAlmond": "#FFEBCD",
      "Blue": "#0000FF",
      "BlueViolet": "#8A2BE2",
      "Brown": "#A52A2A",
      "BurlyWood": "#DEB887",
      "CadetBlue": "#5F9EA0",
      "Chartreuse": "#7FFF00",
      "Chocolate": "#D2691E",
      "Coral": "#FF7F50",
      "CornflowerBlue": "#6495ED",
      "Cornsilk": "#FFF8DC",
      "Crimson": "#DC143C",
      "Cyan": "#00FFFF",
      "DarkBlue": "#00008B",
      "DarkCyan": "#008B8B",
      "DarkGoldenRod": "#B8860B",
      "DarkGrey": "#A9A9A9",
      "DarkGreen": "#006400",
      "DarkKhaki": "#BDB76B",
      "DarkMagenta": "#8B008B",
      "DarkOliveGreen": "#556B2F",
      "Darkorange": "#FF8C00",
      "DarkOrchid": "#9932CC",
      "DarkRed": "#8B0000",
      "DarkSalmon": "#E9967A",
      "DarkSeaGreen": "#8FBC8F",
      "DarkSlateBlue": "#483D8B",
      "DarkSlateGrey": "#2F4F4F",
      "DarkTurquoise": "#00CED1",
      "DarkViolet": "#9400D3",
      "DeepPink": "#FF1493",
      "DeepSkyBlue": "#00BFFF",
      "DimGray": "#696969",
      "DodgerBlue": "#1E90FF",
      "FireBrick": "#B22222",
      "FloralWhite": "#FFFAF0",
      "ForestGreen": "#228B22",
      "Fuchsia": "#FF00FF",
      "Gainsboro": "#DCDCDC",
      "GhostWhite": "#F8F8FF",
      "Gold": "#FFD700",
      "GoldenRod": "#DAA520",
      "Grey": "#808080",
      "Green": "#008000",
      "GreenYellow": "#ADFF2F",
      "HoneyDew": "#F0FFF0",
      "HotPink": "#FF69B4",
      "IndianRed": "#CD5C5C",
      "Indigo": "#4B0082",
      "Ivory": "#FFFFF0",
      "Khaki": "#F0E68C",
      "Lavender": "#E6E6FA",
      "LavenderBlush": "#FFF0F5",
      "LawnGreen": "#7CFC00",
      "LemonChiffon": "#FFFACD",
      "LightBlue": "#ADD8E6",
      "LightCoral": "#F08080",
      "LightCyan": "#E0FFFF",
      "LightGoldenRodYellow": "#FAFAD2",
      "LightGrey": "#D3D3D3",
      "LightGreen": "#90EE90",
      "LightPink": "#FFB6C1",
      "LightSalmon": "#FFA07A",
      "LightSeaGreen": "#20B2AA",
      "LightSkyBlue": "#87CEFA",
      "LightSlateGrey": "#778899",
      "LightSteelBlue": "#B0C4DE",
      "LightYellow": "#FFFFE0",
      "Lime": "#00FF00",
      "LimeGreen": "#32CD32",
      "Linen": "#FAF0E6",
      "Magenta": "#FF00FF",
      "Maroon": "#800000",
      "MediumAquaMarine": "#66CDAA",
      "MediumBlue": "#0000CD",
      "MediumOrchid": "#BA55D3",
      "MediumPurple": "#9370D8",
      "MediumSeaGreen": "#3CB371",
      "MediumSlateBlue": "#7B68EE",
      "MediumSpringGreen": "#00FA9A",
      "MediumTurquoise": "#48D1CC",
      "MediumVioletRed": "#C71585",
      "MidnightBlue": "#191970",
      "MintCream": "#F5FFFA",
      "MistyRose": "#FFE4E1",
      "Moccasin": "#FFE4B5",
      "NavajoWhite": "#FFDEAD",
      "Navy": "#000080",
      "OldLace": "#FDF5E6",
      "Olive": "#808000",
      "OliveDrab": "#6B8E23",
      "Orange": "#FFA500",
      "OrangeRed": "#FF4500",
      "Orchid": "#DA70D6",
      "PaleGoldenRod": "#EEE8AA",
      "PaleGreen": "#98FB98",
      "PaleTurquoise": "#AFEEEE",
      "PaleVioletRed": "#D87093",
      "PapayaWhip": "#FFEFD5",
      "PeachPuff": "#FFDAB9",
      "Peru": "#CD853F",
      "Pink": "#FFC0CB",
      "Plum": "#DDA0DD",
      "PowderBlue": "#B0E0E6",
      "Purple": "#800080",
      "Red": "#FF0000",
      "RosyBrown": "#BC8F8F",
      "RoyalBlue": "#4169E1",
      "SaddleBrown": "#8B4513",
      "Salmon": "#FA8072",
      "SandyBrown": "#F4A460",
      "SeaGreen": "#2E8B57",
      "SeaShell": "#FFF5EE",
      "Sienna": "#A0522D",
      "Silver": "#C0C0C0",
      "SkyBlue": "#87CEEB",
      "SlateBlue": "#6A5ACD",
      "SlateGrey": "#708090",
      "Snow": "#FFFAFA",
      "SpringGreen": "#00FF7F",
      "SteelBlue": "#4682B4",
      "Tan": "#D2B48C",
      "Teal": "#008080",
      "Thistle": "#D8BFD8",
      "Tomato": "#FF6347",
      "Turquoise": "#40E0D0",
      "Violet": "#EE82EE",
      "Wheat": "#F5DEB3",
      "White": "#FFFFFF",
      "WhiteSmoke": "#F5F5F5",
      "Yellow": "#FFFF00",
      "YellowGreen": "#9ACD32",
    }
  

    const colorNames = Object.keys(namedColors);
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    return namedColors[colorNames[randomIndex]];
  }
  
  

  async loadWordList() {
    const response = await fetch('words.txt');
    const data = await response.text();
    this.wordList = data.split('\n').map(word => word.trim());
  }
  
  async loadPuzzles() {
    const response = await fetch('puzzles.json');
    const data = await response.json();
    this.puzzles = data;
  }
  


  setupEventListeners() {
    const gridElement = document.getElementById('grid');
    const hammer = new Hammer(gridElement);

    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('swipe', async event => {
      // Handle swipe events and update the game state
      // Assume a function getSwipeDirection(event) that returns the swipe direction
      const direction = this.getSwipeDirection(event);
      const { row, column } = this.getSwipeTarget(event);

      console.log(direction)
      console.log(row, column)

      if ((direction === 'left' || direction === 'right') && row !== null) {
        this.grid.shiftRow(row, direction);
      } else if ((direction === 'up' || direction === 'down') && column !== null) {
        this.grid.shiftColumn(column, direction);
      }
      

      this.update();
    });

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
      this.reset();
    });

    document.getElementById('play-button').addEventListener('click', function() {
      document.getElementById('rulesCard').style.display = 'none';
    });
    
    document.getElementById('rules-button').addEventListener('click', function() {
      let gameContainer = document.getElementById('game-container');
      let rulesCard = document.getElementById('rulesCard');
  
      // Getting dimensions of gameContainer
      let gameContainerStyles = window.getComputedStyle(gameContainer);
      let gameContainerWidth = gameContainerStyles.getPropertyValue('width');
      let gameContainerHeight = gameContainerStyles.getPropertyValue('height');
  
      // Setting the dimensions of rulesCard to match gameContainer
      rulesCard.style.width = gameContainerWidth;
      rulesCard.style.height = gameContainerHeight;

      document.getElementById('rulesCard').style.display = 'flex';
    });
  
  }

  getSwipeDirection(event) {
    switch (event.direction) {
      case Hammer.DIRECTION_UP:
        return 'up';
      case Hammer.DIRECTION_DOWN:
        return 'down';
      case Hammer.DIRECTION_LEFT:
        return 'left';
      case Hammer.DIRECTION_RIGHT:
        return 'right';
    }
  }
  

  getSwipeTarget(event) {
  
    const tileElements = Array.from(document.getElementsByClassName('tile'));
    const index = tileElements.indexOf(event.target);
  
    if (index === -1) {
      // The event target was not a tile, ignore the swipe
      return { row: null, column: null };
    }
  
    // Determine the row and column of the tile
    const row = Math.floor(index / 5);
    const column = index % 5;
  
    return { row, column };
  }
  
  

  update() {
    const score = this.grid.checkWords();
    this.score = score;
    this.updateUI();
  }
  

  updateUI() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
  
    this.grid.tiles.forEach(row => {
      row.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.textContent = tile.letter;
  
        // const animationDuration = 250;
        // setTimeout(() => {
          if (tile.doubleHighlighted) {
            tileElement.classList.add('double-highlighted');
          } else if (tile.highlighted) {
            tileElement.classList.add('highlighted');
          } else {
            tileElement.classList.remove('highlighted');
            tileElement.classList.remove('double-highlighted');
          }
        // }, animationDuration);
  
        if (tile.animate) {
          tileElement.classList.add(`animate-${tile.animationDirection}`);
          tile.animate = false;
        }

        if (tile.fadeOut) {
          tileElement.classList.add(`fade-out`);
          tile.fadeOut = false;
        }

        if (tile.fadeIn) {
          tileElement.classList.add(`fade-in`);
          tile.fadeIn = false;
        }
  
        gridElement.appendChild(tileElement);
      });
    });


    

    const scoreElement = document.getElementById('score-value');
    scoreElement.textContent = `${this.score}`;
}


  async reset() {
    this.grid.reset();
    this.score = 0;
    this.update();
  }
  
}

