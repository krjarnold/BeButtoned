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
	
	  init() {
	    this.$board = this.createBoard();
	  }
	
	  createBoard() {
	
	    this.rows = [[], [], [], [], [], [], [], []];
	    this.columns = [[], [], [], [], [], [], [], []];
	    this.$board = $("<ul>").addClass("board");
	
	    let tiles = [];
	    for (let row = 0; row < 8; row++) {
	      for (let column = 0; column < 8; column++) {
	        let $tile = $('<li class="tile">'+this.randomButton()+'</li>');
	        $tile.data("pos", [row, column]);
	        this.rows[row].push($tile);
	        this.columns[column].push($tile);
	        this.$board.prepend($tile);
	      }
	    }
	    // this.handleRows();
	    // this.handleColumns ();
	
	    debugger
	    return this.$board;
	  }
	
	  randomButton() {
	    return `${ButtonConstants[Math.floor((Math.random() * 7) + 1)]}`;
	  }
	
	  // handleRows () {
	  //   let clusters = [];
	  //   this.$board.children().each ( (i, row) => {
	  //     debugger
	  //
	  //     this.rows.push(row);
	  //   });
	  // }
	  //
	  // handleColumns () {
	  //   let clusters = [];
	  //   this.$board.each ( (i, row) => {
	  //     rows.each( (j, column) => {
	  //       this.columns[j].push(row);
	  //     });
	  //   });
	  // }
	
	
	
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
	
	    this.game.init();
	    let start = this.game.createBoard();
	    this.$el.append(start);
	  }
	
	  // createBoard() {
	  //   this.$board = $("<ul>").addClass("board");
	  //   // let $button = `${ButtonConstants[Math.floor((Math.random() * 7) + 1)]}`;
	  //   // let $button = this.randomButton();
	  //   debugger
	  //
	  //   let tiles = [];
	  //   for (let row = 0; row < 8; row++) {
	  //     for (let column = 0; column < 8; column++) {
	  //       let $tile = $('<li class="tile">'+this.randomButton()+'</li>');
	  //       // debugger
	  //       // $tile.html($button);
	  //       $tile.data("pos", [row, column]);
	  //       this.$board.append($tile);
	  //     }
	  //   }
	  //   // debugger
	  //   this.$el.append(this.$board);
	  //   // this.addButtons();
	  // }
	  //
	  // randomButton() {
	  //   return `${ButtonConstants[Math.floor((Math.random() * 7) + 1)]}`;
	  // }
	
	
	
	  // addButtons() {
	  //   let $button = $(`${ButtonConstants[Math.floor((Math.random() * 7) + 1)]}`).addClass("button");
	  //   this.$board.children().each( (index, el) => {
	  //     $button.appendTo(el);
	  //   });
	  //   this.$board.children()
	  // }
	
	
	}
	
	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports) {

	ButtonConstants = {
	  1: "<img class=button value= 1 src='./images/red_button.png' >",
	  2: "<img class=button value= 1 src='./images/yellow_button.png' >",
	  3: "<img class=button value= 3 src='./images/green_button.png' >",
	  4: "<img class=button value= 1 src='./images/blue_button.png' >",
	  5: "<img class=button value= 1 src='./images/teal_button.png' >",
	  6: "<img class=button value= 1 src='./images/pink_button.png' >",
	  7: "<img class=button value= 1 src='./images/purple_button.png' >",
	};
	
	module.exports = ButtonConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map