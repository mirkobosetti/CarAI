class Car {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.speed = 0
		this.accelleration = 0.1

		this.maxForwardSpeed = 2
		this.maxBackwardSpeed = 1
		this.friction = 0.01

		this.angle = 0

		this.damaged = false

		this.sensor = new Sensor(this)
		this.controls = new Controls()
	}

	update(roadBorders) {
		if (!this.damaged) {
			this.#move()
			this.poligons = this.#createPolygon()
			this.damaged = this.#assessDamage(roadBorders)
		}
		this.sensor.update(roadBorders)
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

	#assessDamage(roadBorders) {
		for (let i = 0; i < roadBorders.length; i++) {
			if (polysIntersect(this.poligons, roadBorders[i])) {
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

	draw(ctx) {
		if (this.damaged) ctx.fillStyle = 'gray'
		else ctx.fillStyle = 'black'

		ctx.beginPath()
		ctx.moveTo(this.poligons[0].x, this.poligons[0].y)

		for (let i = 1; i < this.poligons.length; i++) {
			ctx.lineTo(this.poligons[i].x, this.poligons[i].y)
		}

		ctx.fill()

		this.sensor.draw(ctx)
	}
}
