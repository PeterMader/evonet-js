EVONET.creatures = {}

EVONET.creatures.manager = {
  creatures: [],
  initialize: () => {
    let i
    for (i = 0; i < EVONET.config.MIN_CREATURES; i += 1) {
      EVONET.creatures.manager.spawn(new EVONET.creatures.Creature())
    }
  },
  spawn: (creature) => {
    EVONET.creatures.manager.creatures.push(creature)
  },
  update: () => {
    EVONET.creatures.manager.creatures.forEach((creature) => {
      creature.update()
    })
  },
  kill: (creature) => {
    const index = EVONET.creatures.manager.creatures.indexOf(creature)
    EVONET.creatures.manager.creatures.splice(index, 1)
    if (EVONET.creatures.manager.creatures.length < EVONET.config.MIN_CREATURES) {
      EVONET.creatures.manager.spawn(new EVONET.creatures.Creature())
    }
  }
}

EVONET.creatures.Creature = function (parent) {
  let brain
  let x = Math.random() * EVONET.config.GAME_WIDTH / 2 + 2,
      y = Math.random() * EVONET.config.GAME_HEIGHT / 2 + 2,
      energy = EVONET.config.ENERGY_AT_BIRTH,
      age = 0,
      viewAngle = 0,
      feelerX = 0,
      feelerY = 0

  let positionTile = EVONET.map.getTile(x, y)
  let feelerTile = EVONET.map.getTile(feelerX, feelerY)

  const consts = EVONET.constants

  let inBias,
      inFoodValuePosition,
      inFoodValueFeeler,
      inIsCreatureOnLand,
      inIsFeelerOnLand,
      inEnergy,
      inAge

  let outRotate,
      outMove,
      outEat,
      outBirth

  if (typeof parent === 'object' && parent instanceof EVONET.creatures.Creature) {
    this.color = EVONET.math.mutateColor(parent.color)
    brain = this.brain = parent.brain.clone()
    const parentPos = parent.getPosition()
    x = parentPos.x
    y = parentPos.y

    inBias = brain.getInputByName(consts.IN_BIAS)
    inFoodValuePosition = brain.getInputByName(consts.IN_FOOD_VALUE_POSITION)
    inFoodValueFeeler = brain.getInputByName(consts.IN_FOOD_VALUE_FEELER)
    inIsCreatureOnLand = brain.getInputByName(consts.IN_IS_CREATURE_ON_LAND)
    inIsFeelerOnLand = brain.getInputByName(consts.IN_IS_FEELER_ON_LAND)
    inEnergy = brain.getInputByName(consts.IN_ENERGY)
    inAge = brain.getInputByName(consts.IN_AGE)

    outRotate = brain.getOutputByName(consts.OUT_ROTATE)
    outMove = brain.getOutputByName(consts.OUT_MOVE)
    outEat = brain.getOutputByName(consts.OUT_EAT)
    outBirth = brain.getOutputByName(consts.OUT_BIRTH)
  } else {
    this.color = EVONET.math.randomColor()
    brain = this.brain = new EVONET.network.NeuronalNetwork()
    inBias = new EVONET.network.Neuron(consts.IN_BIAS)
    inFoodValuePosition = new EVONET.network.Neuron(consts.IN_FOOD_VALUE_POSITION)
    inFoodValueFeeler = new EVONET.network.Neuron(consts.IN_FOOD_VALUE_FEELER)
    inIsCreatureOnLand = new EVONET.network.Neuron(consts.IN_IS_CREATURE_ON_LAND)
    inIsFeelerOnLand = new EVONET.network.Neuron(consts.IN_IS_FEELER_ON_LAND)
    inEnergy = new EVONET.network.Neuron(consts.IN_ENERGY)
    inAge = new EVONET.network.Neuron(consts.IN_AGE)

    outRotate = new EVONET.network.WorkingNeuron(consts.OUT_ROTATE)
    outMove = new EVONET.network.WorkingNeuron(consts.OUT_MOVE)
    outEat = new EVONET.network.WorkingNeuron(consts.OUT_EAT)
    outBirth = new EVONET.network.WorkingNeuron(consts.OUT_BIRTH)

    brain.addInputs([
      inBias,
      inFoodValuePosition,
      inFoodValueFeeler,
      inIsCreatureOnLand,
      inIsFeelerOnLand,
      inEnergy,
      inAge
    ])
    brain.addOutputs([outRotate, outMove, outEat, outBirth])
  }

  brain.generateHiddenNeurons(10)
  brain.generateFullMesh()

  const calculateFeelerPos = () => {
    feelerX = x + Math.sin(viewAngle) * .1
    feelerY = y - Math.cos(viewAngle) * .1
  }

  const readSensors = () => {
    inBias.setValue(1)
    inFoodValuePosition.setValue(positionTile.getFoodValue())
    inFoodValueFeeler.setValue(feelerTile.getFoodValue())
    inIsCreatureOnLand.setValue(positionTile.isLand() ? 1 : 0)
    inIsFeelerOnLand.setValue(feelerTile.isLand() ? 1 : 0)
    inEnergy.setValue(energy)
    inAge.setValue(age)
  }

  const act = () => {
    rotate(outRotate.getValue())
    move(outMove.getValue())
    eat(outEat.getValue())
    giveBirth(outBirth.getValue())

    if (energy < EVONET.config.MIN_ENERGY) {
      kill()
    }
  }

  const rotate = (angle) => {
    viewAngle += angle * .5
    energy -= Math.abs(angle * .1)
  }

  const move = (force) => {
    x += Math.cos(viewAngle) * force
    y += Math.sin(viewAngle) * force
    energy -= Math.abs(force * .1)
  }

  const eat = (eatWish) => {
    const foodValue = positionTile.getFoodValue()
    const maxEatValue = EVONET.config.MAX_EAT_VALUE
    if (foodValue > EVONET.config.MIN_EDIBLE) {
      let eatValue = eatWish * 20
      if (eatValue > maxEatValue) {
        eatValue = maxEatValue
      }
      energy += eatValue
      positionTile.setFoodValue(foodValue - eatValue)
    }
  }

  const kill = () => {
    EVONET.creatures.manager.kill(this)
  }

  const giveBirth = (birthwish) => {
    if (birthwish > 0 && energy > EVONET.config.ENERGY_AT_BIRTH * 2.2) {
      const child = new EVONET.creatures.Creature(this)
      energy -= EVONET.config.ENERGY_AT_BIRTH
      EVONET.creatures.manager.spawn(child)
      console.log('Spawned a child!')
    }
  }

  this.update = () => {
    calculateFeelerPos()
    positionTile = EVONET.map.getTile(x, y)
    feelerTile = EVONET.map.getTile(feelerX, feelerY)
    age += .1
    energy -= age * .5
    readSensors()
    act()
  }

  this.getPosition = () => {
    return  {x, y}
  }
  this.getFeelerPosition = () => {
    return {x: feelerX, y: feelerY}
  }
  this.getAge = () => age
  this.getEnergy = () => energy

}
