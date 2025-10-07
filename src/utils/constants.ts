/**
 * Global constants for the CarAI simulation
 */

import type { SimulationConfig } from '../types'

export const SIMULATION_CONFIG: SimulationConfig = {
	// Road configuration
	LANE_NUMBER: 3,

	// Car configuration
	CARS_NUMBER: 100,

	// Auto-restart configuration
	STUCK_THRESHOLD: 300, // frames without progress before reset (~5 seconds at 60fps)
	MIN_PROGRESS: 5, // minimum distance progress required (pixels)

	// Neural network architecture
	NETWORK_ARCHITECTURE: [7, 6, 4], // [input sensors, hidden nodes, output controls]

	// Genetic algorithm
	MUTATION_RATE: 0.1
}

export const CANVAS_CONFIG = {
	NETWORK_WIDTH: 400,
	NETWORK_HEIGHT: 500,
	MAIN_MARGIN: 120 // Account for header
} as const

export const STORAGE_KEYS = {
	BEST_BRAIN: 'bestBrain',
	GENERATION: 'generation'
} as const

export const SIMULATION_SPEEDS = [0.5, 1, 2, 3, 5] as const

export const CAR_CONFIG = {
	WIDTH: 30,
	HEIGHT: 50,
	MAX_SPEED: 4,
	START_Y: 100,
	START_LANE: 1
} as const

export const COLORS = {
	BEST_CAR: 'blue',
	TRAFFIC: 'black',
	DAMAGED: 'gray'
} as const
