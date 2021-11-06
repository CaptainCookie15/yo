import kaboom from "kaboom";

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0,0,0,1],
  background: [ 0, 0, 0],
});

loadRoot('https://i.imgur.com/')
loadSprite('player', '1Xq9biB.png')

add([
  sprite("player")
   ])
