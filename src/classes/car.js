import { Sensor } from './sensors.js'
import { Controls } from './controls.js'
import { NeuralNetwork } from './network.js'
import { polysIntersect } from './utils.js'

export class Car {
	constructor(id, x, y, width, height, controlType, maxForwardSpeed = 1) {
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

		if (controlType !== 'DUMMY') {
			this.sensor = new Sensor(this)

			// input sensors
			// middle hidden 6 nodes
			// 4 output nodes for movements
			this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
		}

		this.controls = new Controls(controlType)
	}

	update(roadBorders, traffic) {
		if (!this.damaged) {
			this.#move()
			this.polygon = this.#createPolygon()
			this.damaged = this.#assessDamage(roadBorders, traffic)
		}

		if (this.sensor) {
			this.sensor.update(roadBorders, traffic)
			const offset = this.sensor.readings.map((s) => (s == null ? 0 : 1 - s.offset))
			const outputs = NeuralNetwork.feedForward(offset, this.brain)

			if (this.useBrain) {
				this.controls.up = outputs[0]
				this.controls.left = outputs[1]
				this.controls.right = outputs[2]
				this.controls.down = outputs[3]
			}
		}
	}

	#createPolygon() {
		// 1 point for each corner of the car
		const points = []
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

	#assessDamage(roadBorders, traffic) {
		for (let i = 0; i < roadBorders.length; i++) {
			if (polysIntersect(this.polygon, roadBorders[i])) {
				return true
			}
		}

		for (let i = 0; i < traffic.length; i++) {
			if (polysIntersect(this.polygon, traffic[i].polygon)) {
				return true
			}
		}

		return false
	}

	#move() {
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

	draw(ctx, color, showSensors = false) {
		if (this.damaged) ctx.fillStyle = 'gray'
		else ctx.fillStyle = color

		ctx.beginPath()
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
		}

		ctx.fill()

		if (this.sensor && showSensors) this.sensor.draw(ctx)
	}

	/**
	 * TODO:
	 * generates a car array
	 * @param {number} carCount the number of cars to create
	 * @param {number} laneCount the number of road lanes
	 * @returns {Car[]} the created cars
	 */
	static generateTrafficArray(carCount, laneCount) {
		const traffic = []

		for (let i = 0; i < count; i++) {
			const x = Math.random() * mainCanvas.width
			const y = Math.random() * mainCanvas.height
			const angle = Math.random() * 2 * Math.PI
			const speed = Math.random() * 5
			const color = '#' + Math.floor(Math.random() * 16777215).toString(16)

			traffic.push(new Car(x, y, angle, speed, color, 'DUMMY'))
		}

		return traffic
	}

	/**
	 * generates a car array used for training
	 * @param {Road} road the road object
	 * @returns {Car[]} the created cars
	 */
	static generateTrainingTraffic(road) {
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

		const traffic = []

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
