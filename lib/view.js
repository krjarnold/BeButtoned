const ButtonConstants = require('./button_constants');
const Game = require('./game');

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
