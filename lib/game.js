const View = require('./view');
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
