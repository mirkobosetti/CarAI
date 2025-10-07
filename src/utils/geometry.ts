/**
 * Geometry and math utility functions
 */

import type { Point, Intersection } from '../types'

/**
 * Linear interpolation between two values
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0 to 1)
 * @returns Interpolated value
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/**
 * Find intersection point between two line segments
 * @param a - Start point of first line
 * @param b - End point of first line
 * @param c - Start point of second line
 * @param d - End point of second line
 * @returns Intersection point with offset, or null if no intersection
 */
export function getIntersection(a: Point, b: Point, c: Point, d: Point): Intersection | null {
	const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
	const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y)
	const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)

	if (bottom !== 0) {
		const t = tTop / bottom
		const u = uTop / bottom
		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
			return {
				x: lerp(a.x, b.x, t),
				y: lerp(a.y, b.y, t),
				offset: t
			}
		}
	}

	return null
}

/**
 * Check if two polygons intersect
 * @param poly1 - First polygon as array of points
 * @param poly2 - Second polygon as array of points
 * @returns True if polygons intersect
 */
export function polysIntersect(poly1: Point[], poly2: Point[]): boolean {
	for (let i = 0; i < poly1.length; i++) {
		for (let j = 0; j < poly2.length; j++) {
			const touch = getIntersection(
				poly1[i]!,
				poly1[(i + 1) % poly1.length]!,
				poly2[j]!,
				poly2[(j + 1) % poly2.length]!
			)
			if (touch) return true
		}
	}
	return false
}

/**
 * Convert a value to RGBA color string
 * @param value - Value between -1 and 1
 * @returns RGBA color string
 */
export function getRGBA(value: number): string {
	const alpha = Math.abs(value)
	const R = value < 0 ? 0 : 255
	const G = R
	const B = value > 0 ? 0 : 255
	return `rgba(${R},${G},${B},${alpha})`
}

/**
 * Generate a random color in the blue-purple range
 * @returns HSL color string
 */
export function getRandomColor(): string {
	const hue = 290 + Math.random() * 260
	return `hsl(${hue}, 100%, 60%)`
}

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export function distance(p1: Point, p2: Point): number {
	return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}
