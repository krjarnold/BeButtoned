/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const View = __webpack_require__(2);
	
	$( () => {
	  const rootEl = $(".view");
	  const game = new Game();
	  new View(game, rootEl);
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const View = __webpack_require__(2);
	class Game {
	
	  createBoard() {
	    this.columns = [[], [], [], [], [], [], [], []];
	    this.grid = [[], [], [], [], [], [], [], []];
	    this.$board = $("<ul>").addClass("board");
	    this.validMove = false;
	
	    let counter = 0;
	    for (let row = 0; row < 8; row++) {
	      for (let column = 0; column < 8; column++) {
	        counter += 1;
	        let $tile = $('<li class="tile" >'+this.randomButton()+counter+"   "+[row, column]+'</li>');
	        $tile.data("pos", [row, column]);
	        this.$board.append($tile);
	      }
	    }
	    this.formatColumns();
	    this.formatGrid();
	    this.handleClusters();
	    return this.$board;
	  }
	
	  handleClusters() {
	    if (this.findClusters()) {
	      this.removeClusters();
	    } else if (this.validMove) {
	      console.log("Make a move!");
	    } else if (!this.validMove) {
	        if (this.validMoves()) {
	          console.log("Make a new move!");
	        } else {
	          console.log("Sorry, no moves");
	        }
	    }
	
	  }
	
	  randomButton() {
	    return `${ButtonConstants[Math.floor((Math.random() * 7) + 1)]}`;
	  }
	
	  formatColumns () {
	    this.$board.children().each ( (i, btn) => {
	         this.columns[i % 8].push(btn);
	       });
	    // console.log(JSON.stringify(this.columns));
	  }
	
	  formatGrid () {
	    this.columns.forEach ( (el, i) => {
	      el.forEach ( (el2, j) => {
	        this.grid[j].push(el2);
	      });
	    });
	  }
	
	  findClusters () {
	    this.clusters = [];
	    this.grid.forEach ( (row, i) => {
	      row.forEach ( (btn, j) => {
	        let checked = false;
	        for( let k = 0; k < this.clusters.length; k++ ) {
	          if( this.clusters[k][0] === i && this.clusters[k][1] === j ) {
	            checked = true;
	            break;
	          }
	        }
	        if (checked) {
	          return;
	        }
	        let btnVal = $(btn.children[0]).attr("value");
	        let result = this.check(btnVal, i, j);
	        if (result.length > 0) {
	          result.forEach( (el, i) => { this.clusters.push(el); });
	        }
	      });
	    });
	
	    console.log(this.clusters);
	    return (this.clusters.length > 0) ? true : false;
	  }
	
	  removeClusters() {
	    // remove each button from "columns" so that the buttons shift down, and you can see how many you need to add
	    this.clusters.forEach( (pos, index) => {
	      // the "y" axis for the grid- "x" axis for the column orientation
	      let i = pos[1];
	      // the "x" axis for the grid- "y" axis for the column orientation
	      let j = pos[0];
	      // console.log(i, j);
	      this.columns[i][j] = "empty";
	    });
	
	  let result = [];
	      this.columns.forEach( (el, i) => {
	          result.push(el.filter( (el2, k) => {
	            return el2 !== "empty";
	          }));
	        });
	
	    this.columns = result;
	    console.log("columns_with_deletions");
	    console.log(this.columns);
	    this.addButtons();
	  }
	
	  addButtons() {
	    this.columns.forEach ( (column, index) => {
	      if (column.length !== 8) {
	        let i = column.length;
	        // add buttons until column size reaches 8
	          while (i < 8) {
	            let $tile= ($('<li class="tile">'+this.randomButton()+"   "+[7 - i, index]+'</li>')).data("pos", [7 - i, index]);
	            this.columns[index].unshift($tile[0]);
	            i++;
	          }
	      }
	    });
	    console.log("columns_with_additions");
	    console.log(this.columns);
	    this.grid = [[], [], [], [], [], [], [], []];
	    this.$board = $("<ul>").addClass("board");
	    this.formatGrid();
	    // let value = $(this.grid[0][0].children).attr("value");
	    // let value1 = $(this.grid[0][1].children).attr("value");
	    // let value2 = $(this.grid[0][2].children).attr("value");
	    // let value3 = $(this.grid[0][3].children).attr("value");
	    // let value4 = $(this.grid[0][4].children).attr("value");
	    this.grid.forEach( (row, i) => {
	      row.forEach( (column, j) => {
	        let $tile = $(column).data("pos", [i, j]);
	        this.$board.append($tile);
	      });
	    });
	    console.log("final_grid");
	    console.log(this.grid);
	    console.log("final_board");
	    console.log(this.$board);
	    this.handleClusters();
	  }
	
	  check(btnVal, k, l) {
	    let bonus = false;
	    let clusters = [];
	    // Check rows
	    let i = k;
	    let j = l;
	    let adjacentRow = [[k, l]];
	      j += 1;
	        while (j < 8 && btnVal === $(this.grid[i][j].children).attr("value")) {
	          adjacentRow.push([i, j]);
	          j++;
	        }
	
	    // Check columns
	    let adjacentColumn = [[k, l]];
	    i += 1;
	    j = l;
	      while (i < 8 && btnVal === $(this.grid[i][j].children).attr("value")) {
	        adjacentColumn.push([i, j]);
	        i++;
	      }
	
	      if (adjacentRow.length >= 3 && adjacentColumn.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	        bonus = true;
	      } else if (adjacentRow.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	      } else if (adjacentColumn.length >= 3) {
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	      } else if (adjacentRow.length === 2) {
	        this.checkValidMove(adjacentRow, btnVal, "row");
	      } else if (adjacentColumn.length === 2) {
	        this.checkValidMove(adjacentColumn, btnVal, "column");
	      }
	    return clusters;
	    }
	
	
	
	
	
	  checkValidMove(adjacent, btnVal, type) {
	    if (this.validMove) {
	      return;
	    }
	
	    let btnPos = adjacent[0];
	    let i = btnPos[0];
	    let j = btnPos[1];
	
	    // This checks the delta positions of all possible valid moves in a "horizontal" context for the pair
	    if (type === "row") {
	      if (i + 1 < 8 && j - 1 >= 0 && $(this.grid[i + 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i - 1 >= 0 && j - 1 >= 0 && $(this.grid[i - 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i + 1 < 8 && j + 2 < 8 && $(this.grid[i + 1][j + 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i - 1 >= 0 && j + 2 < 8 && $(this.grid[i - 1][j + 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (j + 3 < 8 && $(this.grid[i][j + 3].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (j - 2 >= 0 && $(this.grid[i][j - 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	      }
	    }
	
	    // This checks the delta positions of all possible valid moves in a "vertical" context for the pair
	    if (type === "column") {
	      if (i - 1 >= 0 && j - 1 >= 0 && $(this.grid[i - 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i - 1 >= 0 && j + 1 < 8 && $(this.grid[i - 1][j + 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i + 2 < 8 && j + 1 < 8 && $(this.grid[i + 2][j + 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i + 2 < 8 && j - 1 >= 0 && $(this.grid[i + 2][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i - 2 >= 0 && $(this.grid[i - 2][j].children).attr("value") === btnVal) {
	        this.validMove = true;
	      } else if (i + 3 < 8 && $(this.grid[i + 3][j].children).attr("value") === btnVal) {
	        this.validMove = true;
	      }
	    }
	  return this.validMove;
	  }
	
	  validMoves() {
	    return false;
	  }
	
	  checkIfCluster(btnVal, k, l) {
	    let cluster = false;
	    // top- Check for a match above the target button
	    if (!cluster && k !== 0) {
	      let index = (k === 1) ? 0 : k - 2;
	      let j = l;
	      let sameVal = [];
	      for (let i = index; i < index + 3; i++) {
	        if (btnVal === $(this.grid[i][j].children).attr("value")) {
	          sameVal.push(true);
	        }
	      }
	      if (sameVal.length === 3) {
	        cluster = true;
	      }
	      // Checks if the one above and one below the target are the same
	      if (k !== 7) {
	        if ( (btnVal === $(this.grid[k + 1][l].children).attr("value")) &&
	              (btnVal === $(this.grid[k - 1][l].children).attr("value"))
	            ){
	          cluster = true;
	        }
	      }
	    }
	
	      // left- Check for a match to the left of the target button
	      if (!cluster && l !== 0) {
	        let i = k;
	        let index = (l === 1) ? 0 : l - 2;
	        let sameVal = [];
	        for (let j = index; j < index + 3; j++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          cluster = true;
	        }
	        // Checks if the one to the left and one to the right of the target are the same
	        if (l !== 7) {
	          if ( (btnVal === $(this.grid[k][l + 1].children).attr("value")) &&
	                (btnVal === $(this.grid[k][l - 1].children).attr("value"))
	              ){
	            cluster = true;
	          }
	        }
	      }
	
	      // bottom- Check for a match to the bottom of the target button
	      if (!cluster) {
	        let index = k;
	        let j = l;
	        let sameVal = [];
	        for (let i = index; i < index + 3 && i < 8; i++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          cluster = true;
	        }
	      }
	
	      // right- Check for a match to the right of the target button
	      if (!cluster) {
	        let i = k;
	        let index = l;
	        let sameVal = [];
	        for (let j = index; j < index + 3 && j < 8; j++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          cluster = true;
	        }
	      }
	    return cluster;
	  }
	
	
	}
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ButtonConstants = __webpack_require__(3);
	const Game = __webpack_require__(1);
	
	class View {
	  constructor(game, $el) {
	    this.game = game;
	    this.$el = $el;
	    this.swap = [];
	
	    this.board = this.game.createBoard();
	    this.$el.append(this.board);
	    this.bindEvents();
	  }
	
	  bindEvents() {
	    this.$el.on("click", "li", ( event => {
	      event.preventDefault();
	      const $button = $(event.currentTarget);
	      this.handleClick($button);
	    }));
	  }
	
	  handleClick($button) {
	    if (this.swap.length < 1) {
	      this.swap.push($button);
	      console.log("Click a button to swap!");
	    } else {
	      this.swap.push($button);
	      this.adjacent();
	    }
	  }
	
	  adjacent() {
	    console.log(this.swap);
	    let firstBtn = this.swap[0];
	    let secondBtn = this.swap[1];
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	    if ( (firstBtnPos[0] + 1 === secondBtnPos[0]) && (firstBtnPos[1] === secondBtnPos[1]) ) {
	      this.validMove(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] - 1 === secondBtnPos[0]) && (firstBtnPos[1] === secondBtnPos[1]) ) {
	      this.validMove(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] === secondBtnPos[0]) && (firstBtnPos[1] + 1 === secondBtnPos[1]) ) {
	      this.validMove(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] === secondBtnPos[0]) && (firstBtnPos[1] - 1 === secondBtnPos[1]) ) {
	      this.validMove(firstBtn, secondBtn);
	    } else {
	      console.log("Pick a button touching the first one!  No diagonals");
	      this.swap.splice(1, 1);
	      console.log(this.swap);
	    }
	  }
	
	  validMove(firstBtn, secondBtn) {
	    console.log("first_board");
	    console.log(this.board);
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	    let btnVal = firstBtn.children().attr("value");
	    this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = firstBtn[0];
	    let result = this.game.checkIfCluster( btnVal, secondBtnPos[0], secondBtnPos[1] );
	    if (result) {
	      this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
	      console.log("swapped_grid");
	      console.log(this.game.grid);
	      this.game.columns[firstBtnPos[1]][firstBtnPos[0]] = secondBtn[0];
	      this.game.columns[secondBtnPos[1]][secondBtnPos[0]] = firstBtn[0];
	      console.log("swapped_columns");
	      console.log(this.game.columns);
	      this.game.handleClusters();
	      console.log("after_clusters_grid");
	      console.log(this.game.grid);
	      console.log("after_clusters_columns");
	      console.log(this.game.columns);
	      this.$el.empty();
	      console.log("final_this_game_$board");
	      console.log(this.game.$board);
	      this.$el.append(this.game.$board);
	    } else {
	      this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = secondBtn[0];
	      console.log("Sorry, not a match- try again");
	    }
	    this.swap = [];
	  }
	
	}
	
	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports) {

	ButtonConstants = {
	  1: "<img class=button value= 1 src='./images/red_button.png' >",
	  2: "<img class=button value= 2 src='./images/yellow_button.png' >",
	  3: "<img class=button value= 3 src='./images/green_button.png' >",
	  4: "<img class=button value= 4 src='./images/blue_button.png' >",
	  5: "<img class=button value= 5 src='./images/teal_button.png' >",
	  6: "<img class=button value= 6 src='./images/pink_button.png' >",
	  7: "<img class=button value= 7 src='./images/purple_button.png' >",
	};
	
	module.exports = ButtonConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map