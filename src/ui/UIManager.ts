/**
 * Manages UI updates and interactions
 */

import type { UIElements } from '../types'
import type { Car } from '../core/Car'

export class UIManager {
	private elements: UIElements

	constructor() {
		this.elements = {
			activeCars: document.getElementById('activeCars')!,
			generation: document.getElementById('generation')!,
			bestDistance: document.getElementById('bestDistance')!,
			bestSpeed: document.getElementById('bestSpeed')!,
			brainStatus: document.getElementById('brainStatus')!,
			statusIndicator: document.getElementById('statusIndicator')!,
			statusText: document.getElementById('statusText')!,
			pauseBtn: document.getElementById('pauseBtn')!,
			resetBtn: document.getElementById('resetBtn')!,
			saveBtn: document.getElementById('saveBtn')!,
			discardBtn: document.getElementById('discardBtn')!,
			speedButtons: document.querySelectorAll('.btn-speed') as NodeListOf<HTMLButtonElement>
		}
	}

	/**
	 * Update statistics display
	 */
	updateStats(cars: Car[], bestCar: Car, maxDistance: number): void {
		const aliveCars = cars.filter((car) => !car.damaged).length
		this.elements.activeCars.textContent = aliveCars.toString()

		const distance = Math.abs(Math.round(bestCar.y / 10))
		this.elements.bestDistance.textContent = `${distance}m`

		const speed = Math.abs(Math.round(bestCar.speed * 50))
		this.elements.bestSpeed.textContent = speed.toString()
	}

	/**
	 * Update generation display
	 */
	updateGeneration(generation: number): void {
		this.elements.generation.textContent = generation.toString()
	}

	/**
	 * Update brain status display
	 */
	updateBrainStatus(hasBrain: boolean): void {
		if (hasBrain) {
			this.elements.brainStatus.textContent = '✅ Brain loaded'
			this.elements.brainStatus.style.color = 'var(--accent-green)'
		} else {
			this.elements.brainStatus.textContent = 'No saved brain'
			this.elements.brainStatus.style.color = 'var(--text-secondary)'
		}
	}

	/**
	 * Update pause button appearance
	 */
	updatePauseButton(isPaused: boolean): void {
		const pauseIcon = document.getElementById('pauseIcon')!
		const pauseText = document.getElementById('pauseText')!

		if (isPaused) {
			pauseIcon.textContent = '▶️'
			pauseText.textContent = 'Resume'
		} else {
			pauseIcon.textContent = '⏸️'
			pauseText.textContent = 'Pause'
		}
	}

	/**
	 * Update simulation speed buttons
	 */
	updateSpeedButtons(currentSpeed: number): void {
		this.elements.speedButtons.forEach((btn) => {
			btn.classList.toggle('active', parseFloat(btn.dataset.speed!) === currentSpeed)
		})
	}

	/**
	 * Show stuck status
	 */
	showStuckStatus(): void {
		this.elements.statusIndicator.classList.add('stuck')
		this.elements.statusText.classList.add('stuck')
		this.elements.statusText.textContent = '⚠️ Stuck'
	}

	/**
	 * Show running status
	 */
	showRunningStatus(): void {
		this.elements.statusIndicator.classList.remove('stuck')
		this.elements.statusText.classList.remove('stuck')
		this.elements.statusText.textContent = '✅ Running'
	}

	/**
	 * Show finishing status
	 */
	showFinishingStatus(): void {
		this.elements.statusIndicator.classList.add('stuck')
		this.elements.statusText.classList.add('stuck')
		this.elements.statusText.textContent = '⏳ Finishing'
	}

	/**
	 * Show generation done status
	 */
	showGenerationDone(): void {
		this.elements.statusIndicator.classList.remove('stuck')
		this.elements.statusIndicator.style.borderLeftColor = 'var(--accent-green)'
		this.elements.statusText.classList.remove('stuck')
		this.elements.statusText.style.color = 'var(--accent-green)'
		this.elements.statusText.textContent = '✅ Gen Done'
	}

	/**
	 * Reset status indicator
	 */
	resetStatus(): void {
		this.elements.statusIndicator.classList.remove('stuck')
		this.elements.statusIndicator.style.borderLeftColor = ''
		this.elements.statusText.classList.remove('stuck')
		this.elements.statusText.style.color = ''
		this.elements.statusText.textContent = '✅ Running'
	}

	/**
	 * Show save feedback
	 */
	showSaveFeedback(): void {
		this.elements.saveBtn.textContent = '✅ Saved!'
		setTimeout(() => {
			this.elements.saveBtn.innerHTML = '💾 Save Best Brain'
		}, 2000)
	}

	/**
	 * Show discard feedback
	 */
	showDiscardFeedback(): void {
		this.elements.discardBtn.textContent = '✅ Discarded!'
		setTimeout(() => {
			this.elements.discardBtn.innerHTML = '🗑️ Discard Saved'
		}, 2000)
	}

	/**
	 * Get UI elements (for event listeners)
	 */
	getElements(): UIElements {
		return this.elements
	}
}
