const Game = require('./game');
const View = require('./view');

$( () => {
  const rootEl = $(".view");
  const game = new Game();
  new View(game, rootEl);

});
