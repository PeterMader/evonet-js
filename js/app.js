const EVONET = {}

document.addEventListener('DOMContentLoaded', () => {
  EVONET.game.initialize()
  EVONET.map = new EVONET.Map(EVONET.config.GAME_WIDTH, EVONET.config.GAME_HEIGHT)

  EVONET.creatures.manager.initialize()
  EVONET.ui.initialize()

  const timeBetweenFrames = 1000 / EVONET.config.FPS
  let timeOfLastFrame = Date.now()

  let exit = false

  EVONET.stop = () => {
    exit = true
  }

  const mainLoop = () => {
    if (Date.now() - timeOfLastFrame >= timeBetweenFrames) {
      EVONET.game.update()
      EVONET.ui.update()
      EVONET.game.draw()
      timeOfLastFrame = Date.now()
    }
    if (exit) {
      return
    }
    requestAnimationFrame(mainLoop)
  }

  mainLoop()
})
