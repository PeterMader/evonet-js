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
  this.clone = () => {
    const copy = new EVONET.network.NeuronConnection(entryNeuron.clone(), weight)
    copy.weight += Math.random() - .5
    return copy
  }
}

EVONET.network.WorkingNeuron = function (name) {
  EVONET.network.Neuron.call(this, name)
  this.connections = []
  this.addConnection = (c) => {
    this.connections.push(c)
  }
  this.getValue = () => {
    let value = 0
    this.connections.forEach((c) => {
      value += c.getValue()
    })
    return EVONET.math.sigmoid(value)
  }
  this.clone = () => {
    const copy = new EVONET.network.WorkingNeuron(name)
    this.connections.forEach((connection) => {
      copy.addConnection(connection.clone())
    })
    return copy
  }
}

EVONET.network.NeuronalNetwork = function () {
  let inputNeurons = [],
      hiddenNeurons = [],
      outputNeurons = []

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
    inputNeurons = inputNeurons.concat(inputs)
  }

  this.addOutputs = (outputs) => {
    outputNeurons = outputNeurons.concat(outputs)
  }

  this.generateHiddenNeurons = (amount) => {
    let i = 0
    for ( ; i < amount; i += 1) {
      hiddenNeurons.push(new EVONET.network.WorkingNeuron())
    }
  }
  this.generateFullMesh = () => {
    let hidden, input, output, indexI, indexH, indexO
    for (indexH in hiddenNeurons) {
      hidden = hiddenNeurons[indexH]
      for (indexI in inputNeurons) {
        input = inputNeurons[indexI]
        hidden.addConnection(new EVONET.network.NeuronConnection(input, Math.random() - .5))
      }
    }
    for (indexO in outputNeurons) {
      output = outputNeurons[indexO]
      for (indexH in hiddenNeurons) {
        hidden = hiddenNeurons[indexH]
        output.addConnection(new EVONET.network.NeuronConnection(hidden, Math.random() - .5))
      }
    }
  }

  this.clone = () => {
    const copy = new EVONET.network.NeuronalNetwork()
    copy.addInputs(inputNeurons.map((input) => input.clone()))
    copy.addOutputs(outputNeurons.map((output) => output.clone()))
    return copy
  }
}
