EVONET.network = {}

EVONET.network.Neuron = function (name) {
  let value = 0
  this.name = name
  this.getValue = () => value
  this.setValue = (v) => {
    value = v
  }
  this.clone = () => {
    return new EVONET.network.Neuron(name)
  }
}

EVONET.network.NeuronConnection = function (entryNeuron, startWeight) {
  let weight = startWeight || 0
  this.getWeight = () => weight
  this.setWeight = (v) => {
    weight = v
  }
  this.getValue = () => {
    return entryNeuron.getValue() * weight
  }
}

EVONET.network.WorkingNeuron = function (name) {
  EVONET.network.Neuron.call(this, name)
  const connections = []
  this.addConnection = (c) => {
    connections.push(c)
  }
  this.getValue = () => {
    let value = 0
    connections.forEach((c) => {
      value += c.getValue()
    })
    return EVONET.math.sigmoid(value)
  }
  this.getConnections = () => connections
  this.clone = () => {
    return new EVONET.network.WorkingNeuron(name)
  }
  this.randomMutation = () => {
    const index = Math.floor(Math.random() * (connections.length))
    const c = connections[index]
    c.setWeight(c.getWeight() + (Math.random() - .5) * EVONET.config.MUTATION_RATE)
  }
}

EVONET.network.NeuralNetwork = function () {
  let inputNeurons = this.inputNeurons = [],
      hiddenNeurons = this.hiddenNeurons = [],
      outputNeurons = this.outputNeurons = []

  this.getInputByName = (name) => {
    let index
    for (index in inputNeurons) {
      const neuron = inputNeurons[index]
      if (neuron.name === name) {
        return neuron
      }
    }
    return null
  }

  this.getOutputByName = (name) => {
    let index
    for (index in outputNeurons) {
      const neuron = outputNeurons[index]
      if (neuron.name === name) {
        return neuron
      }
    }
    return null
  }

  this.addInputs = (inputs) => {
    Array.prototype.push.apply(inputNeurons, inputs)
  }

  this.addOutputs = (outputs) => {
    Array.prototype.push.apply(outputNeurons, outputs)
  }

  this.generateHiddenNeurons = (amount) => {
    let i = 0
    for ( ; i < amount; i += 1) {
      hiddenNeurons.push(new EVONET.network.WorkingNeuron())
    }
  }
  this.generateFullMesh = () => {
    let indexI, indexH, indexO
    for (indexH in hiddenNeurons) {
      const hidden = hiddenNeurons[indexH]
      for (indexI in inputNeurons) {
        const input = inputNeurons[indexI]
        hidden.addConnection(new EVONET.network.NeuronConnection(input))
      }
    }
    for (indexO in outputNeurons) {
      const output = outputNeurons[indexO]
      for (indexH in hiddenNeurons) {
        const hidden = hiddenNeurons[indexH]
        output.addConnection(new EVONET.network.NeuronConnection(hidden))
      }
    }
  }

  this.randomizeAllWeights = () => {
    const setRandom = (connection) => {
      connection.setWeight(Math.random() - .5)
    }

    let indexH, indexO
    for (indexH in hiddenNeurons) {
      const hidden = hiddenNeurons[indexH]
      hidden.getConnections().forEach(setRandom)
    }
    for (indexO in outputNeurons) {
      const output = outputNeurons[indexO]
      output.getConnections().forEach(setRandom)
    }
  }

  this.clone = () => {
    const copy = new EVONET.network.NeuralNetwork()
    copy.addInputs(inputNeurons.map((input) => input.clone()))
    copy.addOutputs(outputNeurons.map((output) => output.clone()))

    copy.generateHiddenNeurons(hiddenNeurons.length)
    copy.generateFullMesh()

    let indexH
    for (indexH in copy.hiddenNeurons) {
      const hiddenC = copy.hiddenNeurons[indexH].getConnections()
      const thisHiddenC = this.hiddenNeurons[indexH].getConnections()
      let indexC
      for (indexC in hiddenC) {
        hiddenC[indexC].setWeight(thisHiddenC[indexC].getWeight())
      }
    }

    let indexO
    for (indexO in copy.outputNeurons) {
      const outputC = copy.outputNeurons[indexO].getConnections()
      const thisOutputC = this.outputNeurons[indexO].getConnections()
      let indexC
      for (indexC in outputC) {
        outputC[indexC].setWeight(thisOutputC[indexC].getWeight())
      }
    }

    copy.randomizeWeights(10)

    return copy
  }

  this.randomizeWeights = (amount) => {
    const numberOfNeurons = hiddenNeurons.length + outputNeurons.length - 2
    let i = 0
    for (; i < amount; i += 1) {
      let neuron
      const neuronIndex = Math.round(Math.random() * numberOfNeurons)
      if (neuronIndex < hiddenNeurons.length) {
        neuron = hiddenNeurons[neuronIndex]
      } else {
        neuron = outputNeurons[neuronIndex - hiddenNeurons.length]
      }
      neuron.randomMutation()
    }
  }
}
