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
	    this.validMovePos = [];
	    this.lost = false;
	    this.score = 0;
	
	    let counter = 0;
	    for (let row = 0; row < 8; row++) {
	      for (let column = 0; column < 8; column++) {
	        counter += 1;
	        let $tile = $('<li class="tile" >'+this.randomButton()+'</li>');
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
	    } else {
	      this.findValidMoves();
	      if (this.validMove) {
	        console.log(this.validMovePos);
	        console.log("Make a move!");
	      } else {
	        this.lost = true;
	        console.log("Sorry..., no moves");
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
	        // This for loop evaluates whether clusters already includes the button
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
	    return (this.clusters.length > 0) ? true : false;
	  }
	
	  removeClusters() {
	    // remove each button from "columns" so that the buttons shift down, and you can see how many you need to add
	    this.clusters.forEach( (pos, index) => {
	      // the "y" axis for the grid- "x" axis for the column orientation
	      let i = pos[1];
	      // the "x" axis for the grid- "y" axis for the column orientation
	      let j = pos[0];
	      // add animations for buttons that have been shifted by a deletion
	      this.columns[i][j] = "empty";
	      for (let k = j - 1; k >= 0; k--) {
	        if (this.columns[i][k] !== "empty") {
	          this.addAnimation(this.columns[i][k].children, "animated fadeInDown");
	        }
	      }
	    });
	
	  let result = [];
	      this.columns.forEach( (el, i) => {
	          result.push(el.filter( (el2, k) => {
	            return el2 !== "empty";
	          }));
	        });
	    this.columns = result;
	    this.addButtons();
	  }
	
	  addButtons() {
	    this.columns.forEach ( (column, index) => {
	      // add buttons until column size reaches 8
	      if (column.length !== 8) {
	        for (let i = column.length; i < 8; i++) {
	          let $tile= ($('<li class="tile">'+this.randomButton()+'</li>')).data("pos", [7 - i, index]);
	          this.addAnimation($tile.children(), "animated fadeInDown");
	          this.columns[index].unshift($tile[0]);
	        }
	      }
	    });
	    this.grid = [[], [], [], [], [], [], [], []];
	    this.$board = $("<ul>").addClass("board");
	    this.formatGrid();
	    this.formatBoard();
	    this.handleClusters();
	  }
	
	  formatBoard() {
	    this.grid.forEach( (row, i) => {
	      row.forEach( (column, j) => {
	        let $tile = $(column).data("pos", [i, j]);
	        this.$board.append($tile);
	      });
	    });
	  }
	
	  addAnimation(element, animationName) {
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    // Animation end is fromt the animation docs
	    $(element).addClass(animationName).one(animationEnd, function() {
	      $(this).removeClass(animationName);
	    });
	  }
	
	
	  check(btnVal, k, l) {
	    this.bonus = false;
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
	
	      if (adjacentRow.length >= 3 || adjacentColumn.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	        this.bonus = true;
	        console.log("bonus-true");
	      } else if (adjacentRow.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	      } else if (adjacentColumn.length >= 3) {
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	      }
	      this.score += (clusters.length * 100);
	      if (this.bonus) {
	        this.score += 500;
	      }
	    return clusters;
	    }
	
	    findValidMoves () {
	      this.validMove = false;
	      this.validMovePos = [];
	      this.grid.forEach ( (row, i) => {
	        row.forEach ( (btn, j) => {
	          if (this.validMove) {
	            return;
	          }
	          let btnVal = $(btn.children[0]).attr("value");
	          this.checkMoves(btnVal, i, j);
	        });
	      });
	    }
	
	    checkMoves(btnVal, k, l) {
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
	
	        if (adjacentRow.length === 2) {
	          this.checkValidMove(adjacentRow, btnVal, "row");
	        } else if (adjacentColumn.length === 2) {
	          this.checkValidMove(adjacentColumn, btnVal, "column");
	        } else {
	          this.validMoves();
	          console.log("no moves in check moves");
	        }
	      }
	
	
	
	
	
	  checkValidMove(adjacent, btnVal, type) {
	    let btnPos = adjacent[0];
	    let i = btnPos[0];
	    let j = btnPos[1];
	
	    // This checks the delta positions of all possible valid moves in a "horizontal" context for the pair
	    if (type === "row" && !this.validMove) {
	      if (i + 1 < 8 && j - 1 >= 0 && $(this.grid[i + 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i + 1][j - 1]);
	        this.validMovePos = [i + 1, j - 1];
	      } else if (i - 1 >= 0 && j - 1 >= 0 && $(this.grid[i - 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i - 1][j - 1]);
	        this.validMovePos = [i - 1, j - 1];
	      } else if (i + 1 < 8 && j + 2 < 8 && $(this.grid[i + 1][j + 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i + 1][j + 2]);
	        this.validMovePos = [i + 1, j + 2];
	      } else if (i - 1 >= 0 && j + 2 < 8 && $(this.grid[i - 1][j + 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i - 1][j + 2]);
	        this.validMovePos = [i - 1, j + 2];
	      } else if (j + 3 < 8 && $(this.grid[i][j + 3].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i][j + 3]);
	        this.validMovePos = [i, j + 3];
	      } else if (j - 2 >= 0 && $(this.grid[i][j - 2].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i][j - 2]);
	        this.validMovePos = [i, j - 2];
	      }
	      // This checks the delta positions of all possible valid moves in a "vertical" context for the pair
	    } else if (type === "column" && !this.validMove) {
	      if (i - 1 >= 0 && j - 1 >= 0 && $(this.grid[i - 1][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i - 1][j - 1]);
	        this.validMovePos = [i - 1, j - 1];
	      } else if (i - 1 >= 0 && j + 1 < 8 && $(this.grid[i - 1][j + 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i - 1][j + 1]);
	        this.validMovePos = [i - 1, j + 1];
	      } else if (i + 2 < 8 && j + 1 < 8 && $(this.grid[i + 2][j + 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i + 2][j + 1]);
	        this.validMovePos = [i + 2, j + 1];
	      } else if (i + 2 < 8 && j - 1 >= 0 && $(this.grid[i + 2][j - 1].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i + 2][j - 1]);
	        this.validMovePos = [i + 2, j - 1];
	      } else if (i - 2 >= 0 && $(this.grid[i - 2][j].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i - 2][j]);
	        this.validMovePos = [i - 2, j];
	      } else if (i + 3 < 8 && $(this.grid[i + 3][j].children).attr("value") === btnVal) {
	        this.validMove = true;
	        // this.validMovePos = $(this.grid[i + 3][j]);
	        this.validMovePos = [i + 3, j];
	      }
	    }
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
	    this.notifications= "information";
	    this.bonus = "Bonus!";
	    this.render("start");
	    this.bindEvents();
	    this.bindDblEvents();
	  }
	
	  bindEvents() {
	    this.$el.on("click", "li", ( event => {
	      event.preventDefault();
	      const $button = $(event.currentTarget).addClass("animated pulse selected");
	      this.handleClick($button);
	    }));
	  }
	
	  bindDblEvents() {
	    this.$el.on("dblclick", "li", ( event => {
	      event.preventDefault();
	      this.handleDblClick();
	    }));
	  }
	
	
	  handleClick($button) {
	    if (this.swap.length < 1) {
	      this.swap.push($button);
	    } else {
	      this.swap.push($button);
	      this.adjacent();
	    }
	  }
	
	  handleDblClick() {
	    this.swap = [];
	    $("li").removeClass("animated pulse selected");
	    // this.render("lost");
	  }
	
	  addNotifications() {
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    this.notifications_container.html(this.notifications);
	
	
	    $(this.notifications_container).show();
	    $(this.notifications_container).addClass("animated fadeIn").one(animationEnd, function() {
	      $(this).removeClass("animated fadeIn");
	    });
	  }
	
	  removeNotifications() {
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	
	    $(this.notifications_container).addClass("animated fadeOut").one(animationEnd, function() {
	      $(this).removeClass("animated fadeOut");
	      $(this).hide();
	    });
	    this.notifications = "";
	  }
	
	  adjacent() {
	  let firstBtn = this.swap[0];
	  let secondBtn = this.swap[1];
	  let firstBtnPos = firstBtn.data("pos");
	  let secondBtnPos = secondBtn.data("pos");
	   if (this.swap.length > 2) {
	    this.notifications = "Oops...you're clicking too fast!  Try again";
	    this.addNotifications();
	    } else if (!firstBtnPos || !secondBtnPos) {
	      this.notifications = "Oops...too many buttons clicked <br/> Double-click any button to start over";
	      this.addNotifications();
	      this.handleDblClick();
	
	    } else if ( (firstBtnPos[0] + 1 === secondBtnPos[0]) && (firstBtnPos[1] === secondBtnPos[1]) ) {
	        this.checkSwap(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] - 1 === secondBtnPos[0]) && (firstBtnPos[1] === secondBtnPos[1]) ) {
	      this.checkSwap(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] === secondBtnPos[0]) && (firstBtnPos[1] + 1 === secondBtnPos[1]) ) {
	      this.checkSwap(firstBtn, secondBtn);
	    } else if ( (firstBtnPos[0] === secondBtnPos[0]) && (firstBtnPos[1] - 1 === secondBtnPos[1]) ) {
	      this.checkSwap(firstBtn, secondBtn);
	    } else {
	      $(secondBtn).removeClass("animated pulse selected");
	      this.notifications = "Pick a button touching the first one! <br/> No diagonals <br/> Double-click any button to clear the selection ";
	      this.addNotifications();
	      this.swap.splice(1, 1);
	      console.log(this.swap);
	    }
	  }
	
	  checkSwap(firstBtn, secondBtn) {
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	
	    if (this.validMove(firstBtn, secondBtn)) {
	      this.buttonSlide(firstBtnPos, secondBtnPos, secondBtn, firstBtn);
	    } else if (this.validMove(secondBtn, firstBtn) ) {
	       this.buttonSlide(secondBtnPos, firstBtnPos, firstBtn, secondBtn);
	    } else {
	      $(firstBtn).removeClass("animated pulse selected");
	      $(secondBtn).removeClass("animated pulse selected");
	      this.game.addAnimation(firstBtn, "animated shake");
	      this.game.addAnimation(secondBtn, "animated shake");
	      this.notifications = "Sorry, not a match- try again";
	      this.addNotifications();
	      this.swap = [];
	    }
	  }
	
	  addSwapAnimation(element, animationName) {
	    let that = this;
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    // Animation end is fromt the animation docs
	    $(element).addClass(animationName).one(animationEnd, function() {
	      $(this).removeClass(animationName);
	      that.renderSwap();
	    });
	  }
	
	  buttonSlide(firstBtnPos, secondBtnPos, slidingBtn, dispBtn) {
	    // fBI = first button "i" index, sBJ = second button "j" index
	    let fBI = firstBtnPos[0];
	    let fBJ = firstBtnPos[1];
	    let sBI = secondBtnPos[0];
	    let sBJ = secondBtnPos[1];
	
	    this.game.formatBoard();
	    this.render("board");
	    if ( (sBI - fBI) === 1 && (fBJ - sBJ) === 0) {
	      // slide top
	      this.game.addAnimation(slidingBtn, "animated slideInUp");
	      this.addSwapAnimation(dispBtn, "animated slideInDown");
	
	    } else if ( (fBI - sBI) === 1 && (fBJ - sBJ) === 0) {
	      // slide bottom
	      this.game.addAnimation(slidingBtn, "animated slideInDown");
	      this.addSwapAnimation(dispBtn, "animated slideInUp");
	
	    } else if ( (fBI - sBI) === 0 && (fBJ - sBJ) === 1) {
	      // slide right
	      this.game.addAnimation(slidingBtn, "animated slideInLeft");
	      this.addSwapAnimation(dispBtn, "animated slideInRight");
	
	    } else if ( (fBI - sBI) === 0 && (sBJ - fBJ) === 1) {
	      // slide left
	      this.game.addAnimation(slidingBtn, "animated slideInRight");
	      this.addSwapAnimation(dispBtn, "animated slideInLeft");
	    }
	  }
	
	  renderSwap() {
	    this.game.bonus = false;
	    this.game.handleClusters();
	    if (this.game.bonus === true) {
	      this.bonusAnimation();
	    }
	    if (this.game.lost) {
	      this.render("board");
	      this.render("lost");
	    } else {
	      this.render("board");
	    }
	  }
	
	  bonusAnimation() {
	    let that = this;
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    this.bonus_container.show();
	    $(this.bonus_container).addClass("animated bounceInDown").one(animationEnd, function() {
	      $(this).removeClass("animated bounceInDown");
	    });
	  }
	
	  validMove(firstBtn, secondBtn) {
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	    let btnVal = firstBtn.children().attr("value");
	    this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
	    this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = firstBtn[0];
	    console.log(this.game.grid);
	    let result = this.game.checkIfCluster( btnVal, secondBtnPos[0], secondBtnPos[1] );
	    if (result) {
	      $(firstBtn).removeClass("animated pulse selected");
	      $(secondBtn).removeClass("animated pulse selected");
	      this.game.columns[firstBtnPos[1]][firstBtnPos[0]] = secondBtn[0];
	      this.game.columns[secondBtnPos[1]][secondBtnPos[0]] = firstBtn[0];
	      this.swap = [];
	      return true;
	    } else {
	      this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = firstBtn[0];
	      this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = secondBtn[0];
	      return false;
	    }
	  }
	
	  handleSwap() {
	    $(firstBtn).removeClass("animated pulse selected");
	    $(secondBtn).removeClass("animated pulse selected");
	    this.game.addAnimation(secondBtn, "animated bounce");
	    this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
	    this.game.columns[firstBtnPos[1]][firstBtnPos[0]] = secondBtn[0];
	    this.game.columns[secondBtnPos[1]][secondBtnPos[0]] = firstBtn[0];
	    this.game.handleClusters();
	
	
	    this.render("board");
	  }
	
	  render(type) {
	    let header_container = $("<div>").addClass("header-container");
	    let header = $("<h1>Be-Buttoned</h1>");
	    header_container.append(header);
	    this.score = $('<div class="score">'+"Score"+"<br/>"+this.game.score+'</div>');
	    this.notifications_container = $('<div class=notifications>'+this.notifications+'</div>');
	    this.bonus_container = $('<div class=bonus>'+this.bonus+'</div>');
	
	
	    if (type === "board") {
	      this.$el.empty();
	      this.$el.append(header_container);
	      this.$el.append(this.game.$board);
	      $("ul").append(this.score);
	      $("ul").append(this.notifications_container);
	      $("ul").append(this.bonus_container);
	
	      if (!this.game.bonus) {
	        $(this.bonus_container).hide();
	      }
	
	      if (this.notifications !== "") {
	        this.removeNotifications();
	      } else if (this.notifications === "") {
	        $(this.notifications_container).hide();
	      }
	    }
	
	    if (type === "lost") {
	      let losing_container = $('<div>').addClass("losing-container");
	      let losing_image = $("<img class=losing-image src=./images/stitched_heart.svg></img>");
	      let losing_text = $('<p class=losing-text>'+"Sorry, <br/> you lost"+'</p>');
	      this.$el.append(losing_container);
	      this.game.addAnimation(losing_image, "animated zoomInDown");
	      this.$el.append(losing_image);
	      this.game.addAnimation(losing_text, "animated flipInX");
	      this.$el.append(losing_text);
	    }
	
	    this.$el.append("<img class=quilt src=./images/quilt_Pattern.svg></img>");
	    this.$el.append("<a class=github href=https://github.com/krjarnold/BeButtoned></a>");
	    $("a").html("<i class=devicon-github-plain></i>");
	
	    if (type === "start") {
	      this.board = this.game.createBoard();
	      this.score = $('<div class="score">'+"Score"+"<br/>"+"0"+'</div>');
	      $(this.board.children().children()).removeClass("animated fadeInDown");
	      $(this.board.children().children()).removeClass("animated flash");
	      this.$el.append(header_container);
	      this.game.addAnimation(header, "animated rubberBand");
	      this.$el.append(this.board);
	      $("ul").append(this.score);
	      $("ul").append(this.notifications_container);
	      $(this.notifications_container).hide();
	
	
	      setTimeout(this.welcome.bind(this), 1600);
	
	    }
	  }
	
	  welcome() {
	    let welcome = $("<p class=welcome >Welcome to Be-Buttoned! Your goal is to match as many buttons as you can! But, you have to match as least three in a row. Click on any button, then click on any button to the top, left, right, or bottom to swap. You can only swap buttons if they make a match of at least three it a row!  Have fun! </p>");
	    let start_button = $("<button><p class=start-text >Start</p></button>").addClass("start-button");
	    let welcome_container = $("<div>").addClass("welcome-container");
	    this.$el.append(welcome_container);
	    this.$el.append(welcome);
	    this.game.addAnimation(welcome, "animated zoomInDown");
	    this.$el.append(start_button);
	    this.game.addAnimation(start_button, "animated rotateIn");
	    this.notifications = "Click two buttons to swap!";
	    this.notifications_container.html(this.notifications);
	    this.$el.on("click", "button", ( event => {
	      event.preventDefault();
	      const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	      const button = $(event.currentTarget);
	      this.notifications_container.show();
	      // debugger
	      $(button).addClass("animated rotateOut").one(animationEnd, function() {
	        $(this).removeClass("animated rotateOut");
	        $(start_button).hide();
	      });
	      $(welcome).addClass("animated zoomOutUp").one(animationEnd, function() {
	        $(this).removeClass("animated zoomOutUp");
	        $(welcome).hide();
	        $(welcome_container).hide();
	      });
	      $(this.notifications_container).addClass("animated fadeIn first").one(animationEnd, function() {
	        $(this).removeClass("animated fadeIn first");
	      });
	    }));
	  }
	
	}
	
	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports) {

	ButtonConstants = {
	  1: "<img class=button value= 1 src='./images/orange_button.svg' >",
	  2: "<img class=button value= 2 src='./images/yellow_button.svg' >",
	  3: "<img class=button value= 3 src='./images/green_button.svg' >",
	  4: "<img class=button value= 4 src='./images/blue_button.svg' >",
	  5: "<img class=button value= 5 src='./images/teal_button.svg' >",
	  6: "<img class=button value= 6 src='./images/pink_button.svg' >",
	  7: "<img class=button value= 7 src='./images/purple_button.svg' >",
	
	  // 8: "<img class=button value= 8 src='./images/purple_button.jpg' >",
	  // 9: "<img class=button value= 9 src='./images/yellow_button.jpg' >",
	  // 10: "<img class=button value= 10 src='./images/green_button.jpg' >",
	  // 11: "<img class=button value= 11 src='./images/blue_button.jpg' >"
	};
	
	module.exports = ButtonConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map