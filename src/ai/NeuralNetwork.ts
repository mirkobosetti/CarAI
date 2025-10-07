/**
 * Neural Network implementation for the AI
 */

import { lerp } from '../utils/geometry'
import type { NetworkLevel, INeuralNetwork } from '../types'

class Level implements NetworkLevel {
	inputs: number[]
	outputs: number[]
	biases: number[]
	weights: number[][]

	constructor(inputCount: number, outputCount: number) {
		this.inputs = new Array(inputCount)
		this.outputs = new Array(outputCount)
		this.biases = new Array(outputCount)
		this.weights = []

		for (let i = 0; i < inputCount; i++) {
			// each input is connected to all outputs
			this.weights[i] = new Array(outputCount)
		}

		Level.#randomize(this)
	}

	static #randomize(level: Level): void {
		for (let i = 0; i < level.inputs.length; i++) {
			for (let j = 0; j < level.outputs.length; j++) {
				level.weights[i]![j] = Math.random() * 2 - 1
			}
		}

		for (let i = 0; i < level.biases.length; i++) {
			level.biases[i] = Math.random() * 2 - 1
		}
	}

	static feedForward(inputs: number[], level: Level): number[] {
		for (let i = 0; i < level.inputs.length; i++) {
			level.inputs[i] = inputs[i]!
		}

		for (let i = 0; i < level.outputs.length; i++) {
			let sum = 0
			for (let j = 0; j < level.inputs.length; j++) {
				sum += level.inputs[j]! * level.weights[j]![i]!
			}
			if (sum > level.biases[i]!) level.outputs[i] = 1
			else level.outputs[i] = 0
		}

		return level.outputs
	}
}

export class NeuralNetwork implements INeuralNetwork {
	levels: Level[]

	constructor(neuronCounts: number[]) {
		this.levels = []
		for (let i = 0; i < neuronCounts.length - 1; i++) {
			this.levels.push(new Level(neuronCounts[i]!, neuronCounts[i + 1]!))
		}
	}

	static feedForward(inputs: number[], network: NeuralNetwork): number[] {
		let outputs = Level.feedForward(inputs, network.levels[0]!)

		for (let i = 1; i < network.levels.length; i++) {
			outputs = Level.feedForward(outputs, network.levels[i]!)
		}

		return outputs
	}

	static mutate(network: NeuralNetwork, mutationRate: number = 1): void {
		network.levels.forEach((level) => {
			for (let i = 0; i < level.biases.length; i++) {
				level.biases[i] = lerp(level.biases[i]!, Math.random() * 2 - 1, mutationRate)
			}
			for (let i = 0; i < level.weights.length; i++) {
				for (let j = 0; j < level.weights[i]!.length; j++) {
					level.weights[i]![j] = lerp(level.weights[i]![j]!, Math.random() * 2 - 1, mutationRate)
				}
			}
		})
	}

	/**
	 * Create a deep copy of a neural network
	 */
	static clone(network: NeuralNetwork): NeuralNetwork {
		const cloned = Object.create(NeuralNetwork.prototype) as NeuralNetwork
		cloned.levels = network.levels.map((level) => {
			const clonedLevel = Object.create(Level.prototype) as Level
			clonedLevel.inputs = [...level.inputs]
			clonedLevel.outputs = [...level.outputs]
			clonedLevel.biases = [...level.biases]
			clonedLevel.weights = level.weights.map((w) => [...w])
			return clonedLevel
		})
		return cloned
	}
}
