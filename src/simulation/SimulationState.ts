/**
 * Manages the simulation state
 */

import type { SimulationState } from '../types'
import { SIMULATION_CONFIG } from '../utils/constants'

export class SimulationStateManager {
	private state: SimulationState

	constructor() {
		this.state = {
			isPaused: false,
			simulationSpeed: 1,
			generation: 1,
			maxDistance: 0,
			startTime: Date.now(),
			lastBestCarY: 0,
			stuckFrameCount: 0,
			resetPending: false
		}
	}

	// Getters
	get isPaused(): boolean {
		return this.state.isPaused
	}

	get simulationSpeed(): number {
		return this.state.simulationSpeed
	}

	get generation(): number {
		return this.state.generation
	}

	get maxDistance(): number {
		return this.state.maxDistance
	}

	get startTime(): number {
		return this.state.startTime
	}

	get lastBestCarY(): number {
		return this.state.lastBestCarY
	}

	get stuckFrameCount(): number {
		return this.state.stuckFrameCount
	}

	get resetPending(): boolean {
		return this.state.resetPending
	}

	get stuckThreshold(): number {
		return SIMULATION_CONFIG.STUCK_THRESHOLD
	}

	get minProgress(): number {
		return SIMULATION_CONFIG.MIN_PROGRESS
	}

	// Setters
	setPaused(value: boolean): void {
		this.state.isPaused = value
	}

	setSimulationSpeed(value: number): void {
		this.state.simulationSpeed = value
	}

	setGeneration(value: number): void {
		this.state.generation = value
	}

	incrementGeneration(): void {
		this.state.generation++
	}

	setMaxDistance(value: number): void {
		this.state.maxDistance = value
	}

	updateMaxDistance(distance: number): void {
		if (distance > this.state.maxDistance) {
			this.state.maxDistance = distance
		}
	}

	setLastBestCarY(value: number): void {
		this.state.lastBestCarY = value
	}

	setStuckFrameCount(value: number): void {
		this.state.stuckFrameCount = value
	}

	incrementStuckFrameCount(): void {
		this.state.stuckFrameCount++
	}

	resetStuckFrameCount(): void {
		this.state.stuckFrameCount = 0
	}

	setResetPending(value: boolean): void {
		this.state.resetPending = value
	}

	resetStartTime(): void {
		this.state.startTime = Date.now()
	}

	// Complex operations
	checkIfStuck(currentProgress: number): boolean {
		if (currentProgress < this.minProgress) {
			this.incrementStuckFrameCount()
			return this.stuckFrameCount > 60 // Show after 1 second
		} else {
			this.resetStuckFrameCount()
			return false
		}
	}

	shouldAutoRestart(): boolean {
		return this.stuckFrameCount >= this.stuckThreshold && !this.resetPending
	}

	togglePause(): void {
		this.state.isPaused = !this.state.isPaused
	}

	reset(): void {
		this.state.maxDistance = 0
		this.state.stuckFrameCount = 0
		this.state.resetPending = false
		this.resetStartTime()
	}

	getElapsedTime(): number {
		return Date.now() - this.state.startTime
	}

	// Get full state (useful for debugging)
	getState(): Readonly<SimulationState> {
		return { ...this.state }
	}
}
