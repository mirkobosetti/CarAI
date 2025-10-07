import { Sensor } from './sensors'
import { Controls, type ControlType } from './controls'
import { NeuralNetwork } from './network'
import { polysIntersect, type Point } from './utils'
import type { Road } from './road'

export class Car {
	id: number | undefined
	x: number
	y: number
	width: number
	height: number
	speed: number
	accelleration: number
	maxForwardSpeed: number
	maxBackwardSpeed: number
	friction: number
	angle: number
	damaged: boolean
	wasBest: boolean
	useBrain: boolean
	sensor?: Sensor
	brain?: NeuralNetwork
	controls: Controls
	polygon: Point[]

	constructor(
		id: number | undefined,
		x: number,
		y: number,
		width: number,
		height: number,
		controlType: ControlType,
		maxForwardSpeed: number = 1
	) {
		this.id = id
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.speed = 0
		this.accelleration = 0.1

		this.maxForwardSpeed = maxForwardSpeed
		this.maxBackwardSpeed = 1
		this.friction = 0.01

		this.angle = 0

		this.damaged = false

		this.wasBest = false

		this.useBrain = controlType == 'AI'

		this.polygon = []

		if (controlType !== 'DUMMY') {
			this.sensor = new Sensor(this)

			// input sensors
			// middle hidden 6 nodes
			// 4 output nodes for movements
			this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
		}

		this.controls = new Controls(controlType)
	}

	update(roadBorders: [Point, Point][], traffic: Car[]): void {
		if (!this.damaged) {
			this.#move()
			this.polygon = this.#createPolygon()
			this.damaged = this.#assessDamage(roadBorders, traffic)
		}

		if (this.sensor) {
			this.sensor.update(roadBorders, traffic)
			const offset = this.sensor.readings.map((s) => (s == null ? 0 : 1 - s.offset))
			const outputs = NeuralNetwork.feedForward(offset, this.brain!)

			if (this.useBrain) {
				this.controls.up = !!outputs[0]!
				this.controls.left = !!outputs[1]!
				this.controls.right = !!outputs[2]!
				this.controls.down = !!outputs[3]!
			}
		}
	}

	#createPolygon(): Point[] {
		// 1 point for each corner of the car
		const points: Point[] = []
		const radius = Math.hypot(this.width, this.height) / 2
		const alpha = Math.atan2(this.width, this.height)

		points.push({
			x: this.x - Math.sin(this.angle - alpha) * radius,
			y: this.y - Math.cos(this.angle - alpha) * radius
		})
		points.push({
			x: this.x - Math.sin(this.angle + alpha) * radius,
			y: this.y - Math.cos(this.angle + alpha) * radius
		})
		points.push({
			x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
			y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius
		})
		points.push({
			x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
			y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius
		})

		return points
	}

	#assessDamage(roadBorders: [Point, Point][], traffic: Car[]): boolean {
		for (let i = 0; i < roadBorders.length; i++) {
			if (polysIntersect(this.polygon, roadBorders[i]!)) {
				return true
			}
		}

		for (let i = 0; i < traffic.length; i++) {
			if (polysIntersect(this.polygon, traffic[i]!.polygon)) {
				return true
			}
		}

		return false
	}

	#move(): void {
		if (this.controls.up) this.speed += this.accelleration
		if (this.controls.down) this.speed -= this.accelleration

		if (this.speed != 0) {
			const flip = this.speed > 0 ? 1 : -1
			if (this.controls.left) this.angle += 0.01 * flip
			if (this.controls.right) this.angle -= 0.01 * flip
		}

		if (this.speed > this.maxForwardSpeed) this.speed = this.maxForwardSpeed
		if (this.speed < -this.maxBackwardSpeed) this.speed = -this.maxBackwardSpeed

		if (this.speed < 0) this.speed += this.friction
		if (this.speed > 0) this.speed -= this.friction

		if (Math.abs(this.speed) < this.friction) this.speed = 0

		this.x -= Math.sin(this.angle) * this.speed
		this.y -= Math.cos(this.angle) * this.speed
	}

	draw(ctx: CanvasRenderingContext2D, color: string, showSensors: boolean = false): void {
		if (this.damaged) ctx.fillStyle = 'gray'
		else ctx.fillStyle = color

		ctx.beginPath()
		ctx.moveTo(this.polygon[0]!.x, this.polygon[0]!.y)

		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i]!.x, this.polygon[i]!.y)
		}

		ctx.fill()

		if (this.sensor && showSensors) this.sensor.draw(ctx)
	}

	/**
	 * generates a car array used for training
	 * @param road the road object
	 * @returns the created cars
	 */
	static generateTrainingTraffic(road: Road): Car[] {
		const visualizer = [
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
			[' ', 'X', 'X'],
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
		for (const piece of visualizer) {
			for (const [i, lane] of piece.entries()) {
				if (lane == 'X')
					traffic.push(new Car(undefined, road.getLaneCenter(i), distanceToDraw, 30, 50, 'DUMMY'))
			}

			distanceToDraw -= distanceEachPiece
		}

		return traffic
	}
}
