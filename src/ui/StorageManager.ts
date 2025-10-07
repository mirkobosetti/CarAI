/**
 * Manages localStorage operations for the simulation
 */

import type { SavedBrain } from '../types'
import { STORAGE_KEYS } from '../utils/constants'

export class StorageManager {
	/**
	 * Save the best brain to localStorage
	 */
	static saveBestBrain(brain: SavedBrain): void {
		try {
			localStorage.setItem(STORAGE_KEYS.BEST_BRAIN, JSON.stringify(brain))
			console.log('✅ Brain saved successfully')
		} catch (error) {
			console.error('❌ Failed to save brain:', error)
		}
	}

	/**
	 * Load the best brain from localStorage
	 */
	static loadBestBrain(): SavedBrain | null {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.BEST_BRAIN)
			if (!saved) return null

			const brain = JSON.parse(saved) as SavedBrain
			console.log('✅ Brain loaded successfully')
			return brain
		} catch (error) {
			console.error('❌ Failed to load brain:', error)
			return null
		}
	}

	/**
	 * Remove the saved brain from localStorage
	 */
	static clearBestBrain(): void {
		try {
			localStorage.removeItem(STORAGE_KEYS.BEST_BRAIN)
			console.log('🗑️ Brain cleared successfully')
		} catch (error) {
			console.error('❌ Failed to clear brain:', error)
		}
	}

	/**
	 * Check if a saved brain exists
	 */
	static hasSavedBrain(): boolean {
		return localStorage.getItem(STORAGE_KEYS.BEST_BRAIN) !== null
	}

	/**
	 * Save the current generation number
	 */
	static saveGeneration(generation: number): void {
		try {
			localStorage.setItem(STORAGE_KEYS.GENERATION, generation.toString())
		} catch (error) {
			console.error('❌ Failed to save generation:', error)
		}
	}

	/**
	 * Load the generation number from localStorage
	 */
	static loadGeneration(): number {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.GENERATION)
			return saved ? parseInt(saved, 10) : 1
		} catch (error) {
			console.error('❌ Failed to load generation:', error)
			return 1
		}
	}

	/**
	 * Clear all simulation data from localStorage
	 */
	static clearAll(): void {
		this.clearBestBrain()
		localStorage.removeItem(STORAGE_KEYS.GENERATION)
		console.log('🗑️ All data cleared')
	}
}
