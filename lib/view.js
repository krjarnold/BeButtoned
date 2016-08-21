const ButtonConstants = require('./button_constants');
const Game = require('./game');

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
