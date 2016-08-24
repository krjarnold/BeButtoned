const ButtonConstants = require('./button_constants');
const Game = require('./game');

class View {
  constructor(game, $el) {
    this.game = game;
    this.$el = $el;
    this.swap = [];

    // this.board = this.game.createBoard();
    // this.$el.append("<h1>Be-Buttoned</h1>");
    // $("h1").addClass("animated rubberBand");
    // this.$el.append("<p class=welcome >Welcome to Be-Buttoned!  Your goal is to match as many buttons as you can!  But, you have to match as least three in a row.  Click on any button, then click on any button to the top, left, right, or bottom to swap.  You can only swap buttons if they make a match of at least three it a row!  Have fun! </p>");
    // this.$el.append(this.board);
    // this.$el.append('<div class="score">'+"Score"+"  "+this.game.score+'</div>');
    this.render("start");
    this.bindEvents();
  }

  bindEvents() {
    this.$el.on("click", "li", ( event => {
      event.preventDefault();
      const $button = $(event.currentTarget).addClass("animated pulse");
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
    let firstBtnPos = firstBtn.data("pos");
    let secondBtnPos = secondBtn.data("pos");
    let btnVal = firstBtn.children().attr("value");
    this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = firstBtn[0];
    let result = this.game.checkIfCluster( btnVal, secondBtnPos[0], secondBtnPos[1] );
    if (result) {
      $(firstBtn).removeClass("animated pulse");
      $(secondBtn).removeClass("animated pulse");
      this.game.grid[firstBtnPos[0]][firstBtnPos[1]] = secondBtn[0];
      this.game.columns[firstBtnPos[1]][firstBtnPos[0]] = secondBtn[0];
      this.game.columns[secondBtnPos[1]][secondBtnPos[0]] = firstBtn[0];
      this.game.handleClusters();


      this.render("board");
    } else {
      this.game.grid[secondBtnPos[0]][secondBtnPos[1]] = secondBtn[0];
      console.log("Sorry, not a match- try again");
    }
    this.swap = [];
  }

  render(type) {
    let header_container = $("<div>").addClass("header-container");
    let header = $("<h1>Be-Buttoned</h1>");
    this.$el.append(header_container);
    header_container.append(header);

    if (type === "board") {
      this.$el.empty();
      this.$el.append(header_container);
      this.$el.append(this.game.$board);
      $("ul").append('<div class="score">'+"Score"+"  "+this.game.score+'</div>');
    }
    // this.game_container = $("<div>").addClass("game-container");
    // let score_container = $("<div>").addClass("score-container");
    // let comments_container = $("<div>").addClass("comments-container");

    this.$el.append("<img class=quilt src=./images/quilt_pattern.svg></img>");
    // this.$el.append(this.game_container);
    // this.game_container.append(score_container);
    // debugger
    if (type === "start") {
      this.board = this.game.createBoard();
      this.game.score = 0;
      this.score = $('<div class="score">'+"Score"+"  "+this.game.score+'</div>');
      // debugger
      $(this.board.children().children()).removeClass("animated fadeInDown");
      // debugger
      // header_container.append(header);
      this.game.addAnimation(header, "animated rubberBand");
      this.$el.append(this.board);
      $("ul").append(this.score);
      // this.$el.append(score_container);
      // $(this.score).hide();
      setTimeout(this.welcome.bind(this), 1600);
      // $("h1").addClass("animated rubberBand");

    }

  }

  welcome() {
    // debugger
    // let buttons = this.board.children().children();
    let welcome = $("<p class=welcome >Welcome to Be-Buttoned! Your goal is to match as many buttons as you can! But, you have to match as least three in a row. Click on any button, then click on any button to the top, left, right, or bottom to swap. You can only swap buttons if they make a match of at least three it a row!  Have fun! </p>");
    let start_button = $("<button><p class=start-text >Start</p></button>").addClass("start-button");
    let welcome_container = $("<div>").addClass("welcome-container");
    this.$el.append(welcome_container);
    this.$el.append(welcome);
    this.game.addAnimation(welcome, "animated zoomInDown");
    this.$el.append(start_button);
    this.game.addAnimation(start_button, "animated rotateIn");
    this.$el.on("click", "button", ( event => {
      event.preventDefault();
      const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      const button = $(event.currentTarget);
      $(button).addClass("animated rotateOut").one(animationEnd, function() {
        $(this).removeClass("animated rotateOut");
        $(start_button).hide();
      });

      $(welcome).addClass("animated zoomOutUp").one(animationEnd, function() {
        $(this).removeClass("animated zoomOutUp");
        $(welcome).hide();
        $(welcome_container).hide();
      });
    }));
  }

}

module.exports = View;
