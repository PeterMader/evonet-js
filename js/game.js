EVONET.game = {
  adjustCanvas: () => {
    const size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
    const height = canvas.height = EVONET.game.height = size
    const width = canvas.width = EVONET.game.width = size
  },
  initialize: () => {
    const canvas = EVONET.game.canvas = document.getElementById('canvas')
    const ctx = EVONET.game.ctx = canvas.getContext('2d')
    EVONET.game.adjustCanvas()
    window.addEventListener('resize', () => {
      EVONET.game.adjustCanvas()
      EVONET.game.draw()
    })
  },
  update: () => {
    EVONET.map.walk((x, y, tile) => {
      if (EVONET.map.isFertile(x, y)) {
        tile.grow()
      }
    })
    EVONET.creatures.manager.update()
  },
  draw: () => {
    const TILE_HEIGHT = EVONET.game.height / EVONET.map.height
    const TILE_WIDTH = EVONET.game.width / EVONET.map.width
    const ctx = EVONET.game.ctx
    EVONET.map.walk((x, y, tile) => {
      ctx.fillStyle = tile.isLand() ? '#00FF00' : '#0000FF'
      ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
      ctx.fillStyle = '#00AA44'
      const food = tile.getFoodValue() / EVONET.config.MAX_FOOD_VALUE
      ctx.fillRect((x + .5 - food * .5) * TILE_WIDTH, (y + .5 - food * .5) * TILE_HEIGHT, TILE_WIDTH * food, TILE_HEIGHT * food)
    })
    const creatures = EVONET.creatures.manager.creatures
    creatures.forEach((creature) => {
      const pos = creature.getPosition()
      const feelerPos = creature.getFeelerPosition()

      // Draw the line between the body and the feeler
      ctx.strokeStyle = '#888888'
      ctx.beginPath()
      ctx.moveTo(pos.x * TILE_WIDTH, pos.y * TILE_HEIGHT)
      ctx.lineTo(feelerPos.x * TILE_WIDTH, feelerPos.y * TILE_HEIGHT)
      ctx.stroke()

      // Draw the body
      ctx.fillStyle = creature.color.string
      ctx.fillRect(pos.x * TILE_WIDTH - 5, pos.y * TILE_HEIGHT - 5, 10, 10)

      // Draw the feeler
      ctx.fillStyle = '#000000'
      ctx.fillRect(feelerPos.x * TILE_WIDTH - 1, feelerPos.y * TILE_HEIGHT - 1, 3, 3)

      // Draw the stats
      ctx.fillText(creature.getAge().toFixed(1), pos.x * TILE_WIDTH + 20, pos.y * TILE_HEIGHT)
      ctx.fillText(creature.getEnergy().toFixed(1), pos.x * TILE_WIDTH + 20, pos.y * TILE_HEIGHT + 10)
    })
  }
}
