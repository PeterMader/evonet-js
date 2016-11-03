EVONET.Map = function (width, height) {
  const heightMap = []
  const octaves = EVONET.config.MAX_OCTAVES,
        startFrequencyX = 2,
        startFrequencyY = 2

  // linear interpolation
  const interpolate = (a, b, t) => (b - a) * t + a

  const walkHeightMap = (callback) => {
    let x = 0
    for ( ; x < width; x += 1) {
      let y = 0
      for ( ; y < height; y += 1) {
        callback(x, y, heightMap[x][y])
      }
    }
  }

  let currentFrequencyX = startFrequencyX,
      currentFrequencyY = startFrequencyY,
      currentAlpha = 1,
      octave = 0

  // fill the height map
  let x = 0
  for ( ; x < width; x += 1) {
    heightMap[x] = []
    let y = 0
    for ( ; y < height; y += 1) {
      heightMap[x][y] = 0
    }
  }

  // main loop
  for ( ; octave < octaves; octave += 1) {
    if (octave > 0) {
      currentFrequencyX *= 2
      currentFrequencyY *= 2
      currentAlpha /= 2
    }

    // create random points
    const discretePoints = []
    let x = 0
    for ( ; x < currentFrequencyX + 1; x += 1) {
      let y = 0
      discretePoints[x] = []
      for ( ; y < currentFrequencyY + 1; y += 1) {
        discretePoints[x][y] = Math.random() * currentAlpha
      }
    }

    walkHeightMap((x, y) => {
      const currentX = x / width * currentFrequencyX
      const currentY = y / height * currentFrequencyY

      const indexX = Math.floor(currentX)
      const indexY = Math.floor(currentY)

      const w0 = interpolate(discretePoints[indexX][indexY], discretePoints[indexX + 1][indexY], currentX - indexX)
      const w1 = interpolate(discretePoints[indexX][indexY + 1], discretePoints[indexX + 1][indexY + 1], currentX - indexX)
      const w = interpolate(w0, w1, currentY - indexY)

      heightMap[x][y] += w
    })
  }

  this.height = height
  this.width = width
  this.walk = walkHeightMap

  const isFertileToNeighbors = (x, y) => {
    if (x < 0 || y < 0 || x >= EVONET.config.GAME_WIDTH || y >= EVONET.config.GAME_HEIGHT) {
      // position out of bounds
      return false
    }

    const tile = heightMap[x][y]
    if (tile.isWater()) {
      return true
    }

    if (tile.isLand() && tile.getFoodValue() > EVONET.config.FOOD_VALUE_AFFECTS_NEIGHBORS) {
      return true
    }
    return false
  }

  this.getTile = (_x, _y) => {
    const x = Math.floor(_x), y = Math.floor(_y)
    if (x < 0 || y < 0 || x >= EVONET.config.GAME_WIDTH || y >= EVONET.config.GAME_HEIGHT) {
      return new EVONET.tiles.Tile(x, y, EVONET.tiles.Tile.OUT_OF_BOUNDS)
    }
    return heightMap[x][y]
  }

  this.isFertile = (x, y) => {
    const tile = heightMap[x][y]
    if (!tile.isLand()) {
      return false
    }
    if (tile.getFoodValue() > EVONET.config.FOOD_VALUE_IS_FERTILE) {
      return true
    }
    if (isFertileToNeighbors(x + 1, y)) {
      return true
    }
    if (isFertileToNeighbors(x - 1, y)) {
      return true
    }
    if (isFertileToNeighbors(x, y + 1)) {
      return true
    }
    if (isFertileToNeighbors(x, y - 1)) {
      return true
    }
    return false
  }

  this.evaluate = () => {
    let max = 0
    walkHeightMap((x, y, value) => {
      if (value > max) {
        max = value
      }
    })
    walkHeightMap((x, y, value) => {
      heightMap[x][y] = value / max
    })
    walkHeightMap((x, y, value) => {
      if (value > .6) {
        heightMap[x][y] = new EVONET.tiles.Tile(x, y, EVONET.tiles.Tile.LAND)
      } else {
        heightMap[x][y] = new EVONET.tiles.Tile(x, y, EVONET.tiles.Tile.WATER)
      }
    })
  }

  this.evaluate()
}
