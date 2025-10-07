/**
 * Main entry point for the CarAI simulation
 */

import './style.css'
import { Car } from './core/Car'
import { Road } from './core/Road'
import { NeuralNetwork } from './ai/NeuralNetwork'
import { Visualizer } from './rendering/Visualizer'
import { SimulationStateManager } from './simulation/SimulationState'
import { TrafficGenerator } from './simulation/TrafficGenerator'
import { UIManager } from './ui/UIManager'
import { StorageManager } from './ui/StorageManager'
import { SIMULATION_CONFIG, CANVAS_CONFIG, CAR_CONFIG, COLORS } from './utils/constants'

// ============================================================================
// Canvas Setup
// ============================================================================

const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const networkCanvas = document.getElementById('networkCanvas') as HTMLCanvasElement

mainCanvas.width = (SIMULATION_CONFIG.LANE_NUMBER * 200) / 3
networkCanvas.width = CANVAS_CONFIG.NETWORK_WIDTH

const mainCtx = mainCanvas.getContext('2d')!
const networkCtx = networkCanvas.getContext('2d')!

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9, SIMULATION_CONFIG.LANE_NUMBER)

// ============================================================================
// State Management
// ============================================================================

const state = new SimulationStateManager()
const ui = new UIManager()

// Load saved generation
state.setGeneration(StorageManager.loadGeneration())

// ============================================================================
// Simulation Variables
// ============================================================================

let cars = generateCars(SIMULATION_CONFIG.CARS_NUMBER)
let traffic = TrafficGenerator.generateTrainingTraffic(road)
let bestCar = cars[0]!

// ============================================================================
// Initialization
// ============================================================================

// Load saved brain if exists
if (StorageManager.hasSavedBrain()) {
	const savedBrain = StorageManager.loadBestBrain()
	if (savedBrain) {
		for (let i = 0; i < cars.length; i++) {
			cars[i]!.brain = savedBrain as NeuralNetwork
			// Mutate all cars except the first one
			if (i !== 0) {
				NeuralNetwork.mutate(cars[i]!.brain!, SIMULATION_CONFIG.MUTATION_RATE)
			}
		}
	}
	ui.updateBrainStatus(true)
} else {
	ui.updateBrainStatus(false)
}

// Initialize UI
ui.updateGeneration(state.generation)
ui.updateStats(cars, bestCar, state.maxDistance)

// ============================================================================
// Event Listeners
// ============================================================================

const elements = ui.getElements()

elements.pauseBtn.addEventListener('click', togglePause)
elements.resetBtn.addEventListener('click', reset)
elements.saveBtn.addEventListener('click', save)
elements.discardBtn.addEventListener('click', discard)

elements.speedButtons.forEach(btn => {
	btn.addEventListener('click', (e) => {
		const speed = parseFloat((e.target as HTMLButtonElement).dataset.speed!)
		setSimulationSpeed(speed)
	})
})

// ============================================================================
// Core Functions
// ============================================================================

function generateCars(n: number): Car[] {
	const cars: Car[] = []
	for (let i = 0; i < n; i++) {
		cars.push(
			new Car(
				i,
				road.getLaneCenter(CAR_CONFIG.START_LANE),
				CAR_CONFIG.START_Y,
				CAR_CONFIG.WIDTH,
				CAR_CONFIG.HEIGHT,
				'AI',
				CAR_CONFIG.MAX_SPEED
			)
		)
	}
	return cars
}

function togglePause(): void {
	state.togglePause()
	ui.updatePauseButton(state.isPaused)
}

function setSimulationSpeed(speed: number): void {
	state.setSimulationSpeed(speed)
	ui.updateSpeedButtons(speed)
}

function reset(): void {
	state.setResetPending(false)

	// Reset simulation
	cars = generateCars(SIMULATION_CONFIG.CARS_NUMBER)
	traffic = TrafficGenerator.generateTrainingTraffic(road)
	bestCar = cars[0]!

	// Reset state
	state.reset()
	state.setLastBestCarY(bestCar.y)

	// Reset UI
	ui.resetStatus()

	// Load brain if exists
	if (StorageManager.hasSavedBrain()) {
		const savedBrain = StorageManager.loadBestBrain()
		if (savedBrain) {
			for (let i = 0; i < cars.length; i++) {
				// Clone the brain so each car has its own independent copy
				cars[i]!.brain = NeuralNetwork.clone(savedBrain as NeuralNetwork)
				if (i !== 0) {
					NeuralNetwork.mutate(cars[i]!.brain!, SIMULATION_CONFIG.MUTATION_RATE)
				}
			}
		}
	}

	// Increment generation
	state.incrementGeneration()
	StorageManager.saveGeneration(state.generation)
	ui.updateGeneration(state.generation)

	// Unpause if paused
	if (state.isPaused) {
		togglePause()
	}
}

function save(): void {
	if (bestCar.brain) {
		StorageManager.saveBestBrain(bestCar.brain)
		ui.updateBrainStatus(true)
		ui.showSaveFeedback()
	}
}

function discard(): void {
	if (state.resetPending) return

	StorageManager.clearAll()
	state.setGeneration(1)
	ui.updateGeneration(state.generation)
	ui.updateBrainStatus(false)
	ui.showDiscardFeedback()

	// Reset with new random brains
	state.setResetPending(true)
	setTimeout(reset, 500)
}

// ============================================================================
// Animation Loop
// ============================================================================

function animate(time?: number): void {
	// Apply simulation speed and pause
	if (!state.isPaused) {
		for (let speedStep = 0; speedStep < state.simulationSpeed; speedStep++) {
			// Update traffic
			for (let i = 0; i < traffic.length; i++) {
				traffic[i]!.update(road.borders, [])
			}

			// Update cars
			for (let i = 0; i < cars.length; i++) {
				cars[i]!.update(road.borders, traffic)
			}

			// Find best car (fitness function)
			const foundBestCar = cars.find((car) => car.y === Math.min(...cars.map((m) => m.y)))
			if (foundBestCar) {
				bestCar = foundBestCar
			}

			// Check if cars are stuck
			const currentProgress = Math.abs(bestCar.y - state.lastBestCarY)
			const isStuck = state.checkIfStuck(currentProgress)

			if (isStuck) {
				ui.showStuckStatus()
			} else {
				state.setLastBestCarY(bestCar.y)
				ui.showRunningStatus()
			}

			// Auto-restart if stuck for too long
			if (state.shouldAutoRestart()) {
				state.setResetPending(true)
				console.log('🚗 Cars stuck detected - Auto restart in 500ms...')
				save()
				setTimeout(reset, 500)
			}

			// Remove cars that are too far from best car (only if not resetting)
			if (!state.resetPending) {
				cars = cars.filter((car) => {
					// Remove if too far behind
					if (car.y > bestCar.y + mainCanvas.height / 2 && !car.damaged) {
						return false
					}
					// Remove if damaged and never was best
					if (car.damaged && !car.wasBest) {
						return false
					}
					return true
				})
			}

			// Mark best car
			cars.forEach(car => {
				if (car.id === bestCar.id) {
					car.wasBest = true
				}
			})
		}

		// Check if all cars are finished
		const aliveCars = cars.filter(car => !car.damaged)
		const allCarsStuck = aliveCars.length > 0 && aliveCars.every(car => Math.abs(car.speed) < 0.1)
		const allCarsDamaged = aliveCars.length === 0

		if (allCarsStuck && aliveCars.length > 0) {
			ui.showFinishingStatus()
		}

		// Generation complete
		if ((allCarsDamaged || (allCarsStuck && state.stuckFrameCount > 120)) && !state.resetPending) {
			state.setResetPending(true)
			console.log('🏁 Generation complete - Next generation in 1s...')
			console.log(`📊 Best distance: ${Math.abs(Math.round(bestCar.y / 10))}m`)
			console.log(`🚗 Alive cars: ${aliveCars.length}`)

			ui.showGenerationDone()
			save()
			setTimeout(reset, 1000)
		}
	}

	// Update statistics
	ui.updateStats(cars, bestCar, state.maxDistance)

	// Update canvas sizes
	mainCanvas.height = window.innerHeight - CANVAS_CONFIG.MAIN_MARGIN
	networkCanvas.height = CANVAS_CONFIG.NETWORK_HEIGHT

	// Render main canvas
	mainCtx.save()
	mainCtx.translate(0, -bestCar.y + mainCanvas.height * 0.7)
	road.draw(mainCtx)

	// Draw traffic with teleportation
	for (let i = 0; i < traffic.length; i++) {
		// Teleport traffic if outside visible area
		if (traffic[i]!.y > bestCar.y + window.innerHeight) {
			traffic[i]!.y -= 4 * window.innerHeight
			traffic[i]!.x = road.getLaneCenter(Math.floor(Math.random() * SIMULATION_CONFIG.LANE_NUMBER))
		}
		traffic[i]!.draw(mainCtx, COLORS.TRAFFIC)
	}

	// Draw all cars with transparency
	mainCtx.globalAlpha = 0.2
	for (let i = 0; i < cars.length; i++) {
		cars[i]!.draw(mainCtx, COLORS.BEST_CAR)
	}

	// Draw best car opaque with sensors
	mainCtx.globalAlpha = 1
	bestCar.draw(mainCtx, COLORS.BEST_CAR, true)
	mainCtx.restore()

	// Render network canvas
	networkCtx.lineDashOffset = time ? -time / 50 : 0
	if (bestCar.brain) {
		Visualizer.drawNetwork(networkCtx, bestCar.brain)
	}

	requestAnimationFrame(animate)
}

// Start animation
animate()
