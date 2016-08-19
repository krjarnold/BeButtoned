const ButtonConstants = require('./button_constants');
const Game = require('./game');

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
