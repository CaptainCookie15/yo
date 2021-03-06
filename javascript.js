import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

kaboom({background: [ 0, 0, 0, ]})

loadRoot('https://i.imgur.com/')
loadSprite("block", "pogC9x5.png");
loadSprite("coin", "wbKxhcd.png");
loadSprite("question", "gesQ1KP.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("pipe-left", "c1cYSbt.png");
loadSprite("pipe-right", "nqQ79eI.png");
loadSprite("pipe-top-left-side", "ReTPiWY.png");
loadSprite("pipe-top-right-side", "hj2GK4n.png");
loadSprite("evil-shroom-1", "KPO3fR9.png");
loadSprite("mario-standing", "Wb1qfhK.png");
loadSprite("mushroom", "0wMd92p.png");
loadSprite("blue-brick", "3e5YRQd.png");
loadSprite("blue-shroom", "SvV4ueD.png");
loadSprite("blue-steel", "gqVoI2b.png");
loadSprite("blue-block", "fVscIbn.png");
loadSprite("blue-brick", "fVscIbn.png");
loadSprite("mario-right", "mO68Zfr.png");
loadSprite("mario-left", "va3Eco3.png");


function patrol(speed = 30, dir = -1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, side) => {
				if (side === "left" || side === "right") {
					dir = -dir;
				}
			});
		},
		update() {
			this.move(speed * dir, 0);
		},
	};
}

let score = 0;

scene("main", ({ level} = { level: 0}) => {

  let isJumping = true


  layers(['obj', 'ui'], 'obj')

  const maps = [[
      '                              ',
      '                              ',
      '                              ',
      '                              ',
      '                              ',
      '    %   =*===                 ',
      '                              ',
      '                      -+      ',
      '             ^   ^    ()      ',
      '=========================   ==',
  ],
   [
      '£                              £',
      '£                              £',
      '£            !                 £',
      '£        @@@@@      s          £',
      '£                 s s s        £',
      '£               s s s s s    -+£',
      '£             s s s s s s    ()£',
      'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
     ],
      [
      '£                              £',
      '£                              £',
      '£                     !    s   £',
      '£                s  s ss   s   £',
      '£           s  s           s   £',
      '£         s                s -+£',
      '£    sss         !         s ()£',
      'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
     ]
  ]


  const levelCfg = {
    width: 20,
    height: 20,
      "=": () => [
        sprite("block"),
        area(),
        solid(),
      ],
      "$": () => [
        sprite("coin"),
        area(),
        'coin'
      ],
      "%": () => [
        sprite("question"),
        area(),
        solid(),
        "coin-suprise"
      ],
      "*": () => [
        sprite("question"),
        area(),
        solid(),
        "mushroom-suprise"
      ],
      "}": () => [
        sprite("unboxed"),
        area(),
        solid(),
      ],
      "-": () => [
        sprite("pipe-top-left-side"),
        scale(0.5),
        area(),
        solid(),
        'pipe'
      ],
      "+": () => [
        sprite("pipe-top-right-side"),
        scale(0.5),
        area(),
        solid(),
        'pipe'
      ],
      "(": () => [
        sprite("pipe-left"),
        scale(0.5),
        area(),
        solid(),
      ],
      ")": () => [
        sprite("pipe-right"),
        scale(0.5),
        area(),
        solid(),
      ],
      "^": () => [
        sprite("evil-shroom-1"),
        area(),
        solid(),
        body(),
        patrol(),
        'dangerous'
      ],
      "#": () => [
        sprite("mushroom"),
        area(),
        solid(),
        body(),
        'mushroom'
      ],
      "£": () => [
        sprite("blue-brick"),
        scale(0.5),
        area(),
        solid(),
      ],
      "z": () => [
        sprite("blue-block"),
        scale(0.5),
        area(),
        solid(),
      ],
      "@": () => [
        sprite("question"),      
        area(),
        solid(),
        'coin-suprise'
      ],
      "!": () => [
        sprite("blue-shroom"),
        scale(0.5),
        area(),
        solid(),
        body(),
        patrol(),
        'dangerous',
      ],
      "s": () => [
        sprite("blue-steel"),
        scale(0.5),
        area(),
        solid(),
      ],
  }


  let JUMP_FORCE = 360

  let BIG_JUMP_FORCE = 540

  let CURRENT_JUMP_FORCE = JUMP_FORCE

  const gameLevel = addLevel(maps[level], levelCfg)

  const scoreLabel = add([
    text(score),
    pos(40,40),
    scale(0.5),
    layer('ui'),
  ])

  add([
    text("Level " + (level + 1)),
    pos(40, 6),
    scale(0.5)
  ])

  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if (isBig) {
          timer -=dt()
          if (timer <=0) {
            this.smallify()
          }
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(0.02)
        timer = 0
        isBig = false
        CURRENT_JUMP_FORCE = JUMP_FORCE
      },
      biggify(time) {
        this.scale = vec2(0.03)
        timer = time
        isBig = true
        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
      }
    }
  }


  const player = add([
    sprite('mario-right'),
    scale(0.02),
    pos(30,0),
    area(),
    body(),
    big(),
    origin('bot')
  ])

  const MOVE_SPEED = 120

  keyDown('left', () => {
    player.use(sprite("mario-left"))
    player.move(-MOVE_SPEED,0)
  })

  keyDown('right', () => {
    player.use(sprite("mario-right"))
    player.move(MOVE_SPEED,0)
  })

  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if(player.grounded())
     player.jump(CURRENT_JUMP_FORCE)
     isJumping = true
  })

  player.on('headbutt', (obj) => {
    if(obj.is('coin-suprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0,1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if(obj.is('mushroom-suprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0,1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  action('mushroom', (m) => {
    m.move(20,0)
  })

  player.collides('mushroom', (m) => {
    player.biggify(6)
    destroy(m)
  })

  player.collides('coin', (c) => {
    score++
    scoreLabel.text = score
    destroy(c)
  })

  player.collides('dangerous', (d) => {
    if( isJumping) {
      destroy(d)
    } else {
    go('lose')
    }
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= 600) {
      go('lose')
    }
  })

  scene("lose", () => {
    add([
    text("You Died!\nPress Space To Restart"),
    ])
    keyPress('space', () => {
      go("main")
      score = 0;
      level = 0
    })
  });


  player.collides('pipe', () => {
    keyPress('down', () => {
      go('main', {
       level: (level + 1) % maps.length,
      })
    })
  })


});

go('main')
