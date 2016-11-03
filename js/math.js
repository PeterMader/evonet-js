EVONET.math = {
  sigmoid: (i) => {
    return 1 / (1 + Math.pow(Math.E, -i))
  },
  randomDec: () => {
    return Math.floor(Math.random() * 255)
  },
  decToHex: (dec) => {
    const hex = dec.toString(16)
    return hex.length > 1 ? hex : '0' + hex
  },
  clampColor: (value) => {
    return value < 0 ? 0 : value > 255 ? 255 : Math.round(value)
  },
  randomColor: () => {
    const r = EVONET.math.randomDec()
    const g = EVONET.math.randomDec()
    const b = EVONET.math.randomDec()
    const rHex = EVONET.math.decToHex(r)
    const gHex = EVONET.math.decToHex(g)
    const bHex = EVONET.math.decToHex(b)
    return {
      r,
      g,
      b,
      string: '#' + rHex + gHex + bHex
     }
  },
  mutateColor: (color) => {
    const copy = {
      r: EVONET.math.clampColor(color.r + (Math.random() - .5) * 5),
      g: EVONET.math.clampColor(color.g + (Math.random() - .5) * 5),
      b: EVONET.math.clampColor(color.b + (Math.random() - .5) * 5),
    }
    copy.string = '#' +
      EVONET.math.decToHex(copy.r) +
      EVONET.math.decToHex(copy.g) +
      EVONET.math.decToHex(copy.b)
    return copy
  }
}
