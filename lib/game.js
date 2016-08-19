const View = require('./view');
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
