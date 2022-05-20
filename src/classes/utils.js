const lerp = (a, b, t) => a + (b - a) * t

const getIntersections = (a, b, c, d) => {
	const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
	const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y)
	const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)

	if (bottom != 0) {
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
}

const polysIntersect = (a, b) => {
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			const touch = getIntersections(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])

			if (touch) return true
		}
	}

	return false
}
