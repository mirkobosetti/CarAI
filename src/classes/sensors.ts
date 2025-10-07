import { lerp, getIntersection, type Point, type Intersection } from './utils'
import type { Car } from './car'

export class Sensor {
	car: Car
	rayCount: number
	rayLength: number
	raySpread: number
	rays: [Point, Point][]
	readings: (Intersection | null)[]

	constructor(car: Car) {
		this.car = car
		this.rayCount = 7
		this.rayLength = 200
		this.raySpread = Math.PI / 2
		this.rays = []
		this.readings = []
	}

	update(roadBorders: [Point, Point][], traffic: Car[]): void {
		this.#castRays()
		this.readings = []

		for (let i = 0; i < this.rays.length; i++)
			this.readings.push(this.#getReading(this.rays[i]!, roadBorders, traffic))
	}

	#getReading(ray: [Point, Point], roadBorders: [Point, Point][], traffic: Car[]): Intersection | null {
		let touches: Intersection[] = []

		for (let i = 0; i < roadBorders.length; i++) {
			const touch = getIntersection(ray[0]!, ray[1]!, roadBorders[i]![0]!, roadBorders[i]![1]!)
			if (touch) {
				touches.push(touch)
			}
		}

		for (let i = 0; i < traffic.length; i++) {
			const poly = traffic[i]!.polygon
			for (let j = 0; j < poly.length; j++) {
				const value = getIntersection(ray[0]!, ray[1]!, poly[j]!, poly[(j + 1) % poly.length]!)
				if (value) {
					touches.push(value)
				}
			}
		}

		if (touches.length == 0) {
			return null
		} else {
			const offsets = touches.map((e) => e.offset)
			const minOffset = Math.min(...offsets)
			return touches.find((e) => e.offset == minOffset) || null
		}
	}

	#castRays(): void {
		this.rays = []

		for (let i = 0; i < this.rayCount; i++) {
			const rayAngle =
				lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) +
				this.car.angle

			const startPoint: Point = { x: this.car.x, y: this.car.y }
			const endPoint: Point = {
				x: this.car.x - Math.sin(rayAngle) * this.rayLength,
				y: this.car.y - Math.cos(rayAngle) * this.rayLength
			}

			this.rays.push([startPoint, endPoint])
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		for (let i = 0; i < this.rayCount; i++) {
			let end: Point = this.rays[i]![1]!
			if (this.readings[i]) end = this.readings[i]!

			ctx.beginPath()
			ctx.lineWidth = 2
			ctx.strokeStyle = 'yellow'
			ctx.moveTo(this.rays[i]![0]!.x, this.rays[i]![0]!.y)
			ctx.lineTo(end.x, end.y)
			ctx.stroke()

			ctx.beginPath()
			ctx.lineWidth = 5
			ctx.strokeStyle = 'red'
			ctx.moveTo(this.rays[i]![1]!.x, this.rays[i]![1]!.y)
			ctx.lineTo(end.x, end.y)
			ctx.stroke()
		}
	}
}
