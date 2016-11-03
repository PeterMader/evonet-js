EVONET.ui = {
  elements: {},
  initialize () {
    this.elements.creatureCount = document.getElementById('stats-creature-count')
    document.getElementById('stop').addEventListener('click', () => {
      EVONET.stop()
    })
  },
  update () {
    this.elements.creatureCount.textContent = EVONET.creatures.manager.creatures.length
  }
}
