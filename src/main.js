const mainCanvas = document.getElementById('mainCanvas')
const networkCanvas = document.getElementById('networkCanvas')

mainCanvas.width = 200
networkCanvas.width = 500

const mainCtx = mainCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 2)

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")]

animate()

function animate(time) {
	for (let i = 0; i < traffic.length; i++) traffic[i].update(road.borders, [])

	car.update(road.borders, traffic)

	mainCanvas.height = window.innerHeight
	networkCanvas.height = window.innerHeight

	mainCtx.save()
	mainCtx.translate(0, -car.y + mainCanvas.height * 0.7)
	road.draw(mainCtx)
	for (let i = 0; i < traffic.length; i++) traffic[i].draw(mainCtx, "black")
	car.draw(mainCtx, "blue")
	mainCtx.restore()

	networkCtx.lineDashOffset = -time/50
	Visualizer.drawNetwork(networkCtx, car.brain)

	requestAnimationFrame(animate)
}
