/**
 * Controls class for handling car inputs
 */

import type { ControlType, IControls } from '../types'

export class Controls implements IControls {
	left: boolean
	right: boolean
	up: boolean
	down: boolean

	constructor(type: ControlType) {
		this.left = false
		this.right = false
		this.up = false
		this.down = false

		switch (type) {
			case 'KEYS':
				this.#addKeyListeners()
				break

			case 'DUMMY':
				this.up = true
				break

			default:
				break
		}
	}

	#addKeyListeners(): void {
		document.addEventListener('keydown', (e: KeyboardEvent): void => {
			switch (e.key) {
				case 'ArrowLeft':
					this.left = true
					break
				case 'ArrowRight':
					this.right = true
					break
				case 'ArrowUp':
					this.up = true
					break
				case 'ArrowDown':
					this.down = true
					break
			}
		})

		document.addEventListener('keyup', (e: KeyboardEvent): void => {
			switch (e.key) {
				case 'ArrowLeft':
					this.left = false
					break
				case 'ArrowRight':
					this.right = false
					break
				case 'ArrowUp':
					this.up = false
					break
				case 'ArrowDown':
					this.down = false
					break
			}
		})
	}
}
