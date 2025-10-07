/**
 * Generates and manages traffic patterns
 */

import { Car } from '../core/Car'
import type { IRoad } from '../types'

export class TrafficGenerator {
	/**
	 * Generate training traffic using a predefined pattern
	 * This creates a challenging obstacle course for the AI to navigate
	 */
	static generateTrainingTraffic(road: IRoad): Car[] {
		// Pattern visualization: X = car, space = empty lane
		const pattern = [
			[' ', 'X', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', ' ', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', ' ', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', ' ', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', ' ', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', ' ', 'X'],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', 'X', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			['X', ' ', 'X']
		].reverse()

		const traffic: Car[] = []
		let distanceToDraw = -100
		const distanceEachPiece = 75

		for (const piece of pattern) {
			for (const [i, lane] of piece.entries()) {
				if (lane === 'X') {
					traffic.push(
						new Car(
							undefined,
							road.getLaneCenter(i),
							distanceToDraw,
							30, // width
							50, // height
							'DUMMY'
						)
					)
				}
			}

			distanceToDraw -= distanceEachPiece
		}

		return traffic
	}

	/**
	 * Generate random traffic (useful for testing different scenarios)
	 */
	static generateRandomTraffic(road: IRoad, count: number = 50): Car[] {
		const traffic: Car[] = []
		let y = -100

		for (let i = 0; i < count; i++) {
			const lane = Math.floor(Math.random() * 3)
			const x = road.getLaneCenter(lane)

			traffic.push(new Car(undefined, x, y, 30, 50, 'DUMMY'))

			y -= 100 + Math.random() * 100 // Random spacing
		}

		return traffic
	}
}
