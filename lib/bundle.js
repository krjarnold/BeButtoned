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
	    console.log("columns_with_deletions");
	    console.log(this.columns);
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
	    console.log("columns_with_additions");
	    console.log(this.columns);
	    this.grid = [[], [], [], [], [], [], [], []];
	    this.$board = $("<ul>").addClass("board");
	    this.formatGrid();
	    this.formatBoard();
	    // this.grid.forEach( (row, i) => {
	    //   row.forEach( (column, j) => {
	    //     let $tile = $(column).data("pos", [i, j]);
	    //     this.$board.append($tile);
	    //   });
	    // });
	    console.log("final_grid");
	    console.log(this.grid);
	    console.log("final_board");
	    console.log(this.$board);
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
	
	      if (adjacentRow.length >= 3 && adjacentColumn.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	        this.bonus = true;
	      } else if (adjacentRow.length >= 3) {
	        adjacentRow.forEach ( (el, i) => { clusters.push(el); } );
	      } else if (adjacentColumn.length >= 3) {
	        adjacentColumn.forEach ( (el, i) => { clusters.push(el); } );
	      } else if (adjacentRow.length === 2) {
	        this.checkValidMove(adjacentRow, btnVal, "row");
	      } else if (adjacentColumn.length === 2) {
	        this.checkValidMove(adjacentColumn, btnVal, "column");
	      }
	      this.score += (clusters.length * 100);
	      if (this.bonus) {
	        this.score += 500;
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
	    console.log("check-if-cluster");
	    console.log(btnVal, k, l);
	    let cluster = false;
	    // top- Check for a match above the target button
	    if (!cluster && k !== 0) {
	      console.log("top");
	      // debugger
	      let index = (k === 1) ? 0 : k - 2;
	      let j = l;
	      let sameVal = [];
	      for (let i = index; i < index + 3; i++) {
	        if (btnVal === $(this.grid[i][j].children).attr("value")) {
	          sameVal.push(true);
	        }
	      }
	      if (sameVal.length === 3) {
	        console.log("check-three-cluster");
	        cluster = true;
	      }
	      // Checks if the one above and one below the target are the same
	      if (k !== 7) {
	        if ( (btnVal === $(this.grid[k + 1][l].children).attr("value")) &&
	              (btnVal === $(this.grid[k - 1][l].children).attr("value"))
	            ){
	          console.log("check-LR-cluster");
	          cluster = true;
	        }
	      }
	    }
	
	      // left- Check for a match to the left of the target button
	      if (!cluster && l !== 0) {
	        console.log("left");
	        // debugger
	        let i = k;
	        let index = (l === 1) ? 0 : l - 2;
	        let sameVal = [];
	        for (let j = index; j < index + 3; j++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          console.log("check-three-cluster");
	          cluster = true;
	        }
	        // Checks if the one to the left and one to the right of the target are the same
	        if (l !== 7) {
	          if ( (btnVal === $(this.grid[k][l + 1].children).attr("value")) &&
	                (btnVal === $(this.grid[k][l - 1].children).attr("value"))
	              ){
	            console.log("check-LR-cluster");
	            cluster = true;
	          }
	        }
	      }
	
	      // bottom- Check for a match to the bottom of the target button
	      if (!cluster) {
	        console.log("bottom");
	        // debugger
	        let index = k;
	        let j = l;
	        let sameVal = [];
	        for (let i = index; i < index + 3 && i < 8; i++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          console.log("bottom");
	          console.log(sameVal);
	          cluster = true;
	        }
	      }
	
	      // right- Check for a match to the right of the target button
	      if (!cluster) {
	        console.log("right");
	        let i = k;
	        let index = l;
	        let sameVal = [];
	        for (let j = index; j < index + 3 && j < 8; j++) {
	          if (btnVal === $(this.grid[i][j].children).attr("value")) {
	            sameVal.push(true);
	          }
	        }
	        if (sameVal.length === 3) {
	          console.log("right");
	          console.log(sameVal);
	          cluster = true;
	        }
	      }
	      console.log("cluster");
	      console.log(cluster);
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
	      // const $button = $(event.currentTarget).addClass("animated pulse");
	      this.handleDblClick();
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
	
	  handleDblClick() {
	    this.swap = [];
	    console.log("swap-after");
	    $("li").removeClass("animated pulse selected");
	    // debugger
	  }
	
	  addNotifications() {
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    this.notifications_container.html(this.notifications);
	
	
	    $(this.notifications_container).show();
	    $(this.notifications_container).addClass("animated fadeIn").one(animationEnd, function() {
	      $(this).removeClass("animated fadeIn");
	    });
	    // setTimeout(this.removeNotifications.bind(this), 1600);
	    // debugger
	  }
	
	  removeNotifications() {
	    // debugger
	    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	
	    $(this.notifications_container).addClass("animated fadeOut").one(animationEnd, function() {
	      $(this).removeClass("animated fadeOut");
	      $(this).hide();
	    });
	    this.notifications = "";
	  }
	
	  adjacent() {
	    console.log(this.swap);
	  let firstBtn = this.swap[0];
	  let secondBtn = this.swap[1];
	  let firstBtnPos = firstBtn.data("pos");
	  let secondBtnPos = secondBtn.data("pos");
	   if (this.swap.length > 2) {
	    this.notifications = "Oops...you're clicking too fast!  Try again";
	    this.addNotifications();
	    // this.swap = [];
	    // debugger
	    } else if (!firstBtnPos || !secondBtnPos) {
	      this.notifications = "Oops...too many buttons clicked.  Try again";
	      this.addNotifications();
	      this.handleDblClick();
	      // debugger
	      // this.swap = [];
	
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
	      this.notifications = "Pick a button touching the first one!  No diagonals";
	      this.addNotifications();
	      // debugger
	      this.swap.splice(1, 1);
	      console.log(this.swap);
	    }
	  }
	
	  checkSwap(firstBtn, secondBtn) {
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	
	    // debugger
	    if (this.validMove(firstBtn, secondBtn)) {
	      // debugger
	      console.log("first-button-checkswap");
	      console.log("true");
	      // console.log(this.validMove(firstBtn, secondBtn));
	      this.buttonSlide(firstBtnPos, secondBtnPos, secondBtn, firstBtn);
	      // return;
	    } else if (this.validMove(secondBtn, firstBtn) ) {
	      // debugger
	      console.log("second-button-checkswap");
	      console.log("true");
	      // console.log(this.validMove(secondBtn, firstBtn));
	       this.buttonSlide(secondBtnPos, firstBtnPos, firstBtn, secondBtn);
	      // return;
	    } else {
	      console.log("no-valid-move");
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
	      // debugger
	      that.renderSwap();
	    });
	  }
	
	  buttonSlide(firstBtnPos, secondBtnPos, slidingBtn, dispBtn) {
	
	    let fBI = firstBtnPos[0];
	    let fBJ = firstBtnPos[1];
	    let sBI = secondBtnPos[0];
	    let sBJ = secondBtnPos[1];
	    // this.game.addAnimation(slidingBtn, "animated bounce");
	    this.game.formatBoard();
	    this.render("board");
	    // slide top
	    if ( (sBI - fBI) === 1 && (fBJ - sBJ) === 0) {
	      this.game.addAnimation(slidingBtn, "animated slideInUp");
	      this.addSwapAnimation(dispBtn, "animated slideInDown");
	      // setTimeout(this.renderSwap.bind(this), 800);
	      // this.renderSwap();
	    } else if ( (fBI - sBI) === 1 && (fBJ - sBJ) === 0) {
	      // slide bottom
	      this.game.addAnimation(slidingBtn, "animated slideInDown");
	      this.addSwapAnimation(dispBtn, "animated slideInUp");
	      // setTimeout(this.renderSwap.bind(this), 800);
	
	    } else if ( (fBI - sBI) === 0 && (fBJ - sBJ) === 1) {
	      // slide right
	      this.game.addAnimation(slidingBtn, "animated slideInLeft");
	      this.addSwapAnimation(dispBtn, "animated slideInRight");
	
	      // setTimeout(this.renderSwap.bind(this), 800);
	
	    } else if ( (fBI - sBI) === 0 && (sBJ - fBJ) === 1) {
	      // slide left
	      this.game.addAnimation(slidingBtn, "animated slideInRight");
	      this.addSwapAnimation(dispBtn, "animated slideInLeft");
	
	      // setTimeout(this.renderSwap.bind(this), 800);
	
	    }
	  }
	
	  renderSwap() {
	    this.game.handleClusters();
	    this.render("board");
	  }
	
	  validMove(firstBtn, secondBtn) {
	    console.log("first-Btn");
	    console.log(firstBtn);
	    console.log("second-Btn");
	    console.log(secondBtn);
	    console.log(this.game.grid);
	    // debugger
	    let firstBtnPos = firstBtn.data("pos");
	    let secondBtnPos = secondBtn.data("pos");
	    let btnVal = firstBtn.children().attr("value");
	    this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
	    this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = firstBtn[0];
	    console.log(this.game.grid);
	    let result = this.game.checkIfCluster( btnVal, secondBtnPos[0], secondBtnPos[1] );
	    // debugger
	    if (result) {
	      // debugger
	      $(firstBtn).removeClass("animated pulse selected");
	      $(secondBtn).removeClass("animated pulse selected");
	      // this.game.addAnimation(secondBtn, "animated bounce");
	      // this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
	      this.game.columns[firstBtnPos[1]][firstBtnPos[0]] = secondBtn[0];
	      this.game.columns[secondBtnPos[1]][secondBtnPos[0]] = firstBtn[0];
	      // this.game.handleClusters();
	      // this.render("board");
	      this.swap = [];
	      return true;
	    } else {
	      // debugger
	      this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = secondBtn[0];
	      // console.log(JSON.stringify(this.game.grid));
	      // debugger
	      // console.log("Sorry, not a match- try again");
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
	    this.$el.append(header_container);
	    header_container.append(header);
	    this.score = $('<div class="score">'+"Score"+"<br/>"+this.game.score+'</div>');
	    this.notifications_container = $('<div class=notifications>'+this.notifications+'</div>');
	
	
	    if (type === "board") {
	      this.$el.empty();
	      this.$el.append(header_container);
	      this.$el.append(this.game.$board);
	      $("ul").append(this.score);
	      $("ul").append(this.notifications_container);
	      console.log("notifications");
	      console.log(this.notifications);
	      // $(this.notifications_container).hide();
	
	      if (this.notifications !== "") {
	        this.removeNotifications();
	      } else if (this.notifications === "") {
	        $(this.notifications_container).hide();
	      }
	
	
	    }
	
	    this.$el.append("<img class=quilt src=./images/quilt_Pattern.svg></img>");
	
	    if (type === "start") {
	      this.board = this.game.createBoard();
	      this.score = $('<div class="score">'+"Score"+"<br/>"+"0"+'</div>');
	      $(this.board.children().children()).removeClass("animated fadeInDown");
	
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
	    // this.notifications_container.html("Click a button to make a move!");
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
	};
	
	module.exports = ButtonConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map