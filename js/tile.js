EVONET.tiles = {}

EVONET.tiles.Tile = function (x, y, type) {
  this.x = x
  this.y = y
  let foodValue = type === EVONET.tiles.Tile.LAND ? 50 : 0
  this.grow = () => {
    if (!this.isLand()) {
      return
    }
    foodValue += EVONET.config.GROWTH_RATE
    if (foodValue > EVONET.config.MAX_FOOD_VALUE) {
      foodValue = EVONET.config.MAX_FOOD_VALUE
    }
  }
  this.getFoodValue = () => foodValue
  this.setFoodValue = (value) => {
    if (!this.isLand()) {
      return
    }
    foodValue = value
  }
  this.isLand = () => type === EVONET.tiles.Tile.LAND
  this.isWater = () => type === EVONET.tiles.Tile.WATER
  this.isOutOfBounds = () => type === EVONET.tiles.Tile.OUT_OF_BOUNDS

}
EVONET.tiles.Tile.LAND = Symbol()
EVONET.tiles.Tile.WATER = Symbol()
EVONET.tiles.Tile.OUT_OF_BOUNDS = Symbol()
