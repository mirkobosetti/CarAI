const mainCanvas = document.getElementById('mainCanvas')
const networkCanvas = document.getElementById('networkCanvas')

mainCanvas.width = 200
networkCanvas.width = 500

const mainCtx = mainCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9)

//single car
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 2)

const CARS_NUMBER = 100
const cars = generateCars(CARS_NUMBER)

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY')]
let bestCar = cars[0]

if (localStorage.getItem('bestBrain')) {
	bestCar.brain = JSON.parse(localStorage.getItem('bestBrain'))
}

animate()

function save() {
	localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
	localStorage.removeItem('bestBrain')
}

function generateCars(n) {
	const cars = []
	for (let i = 0; i < n; i++) {
		cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI', 2))
	}
	return cars
}

function animate(time) {
	for (let i = 0; i < traffic.length; i++) traffic[i].update(road.borders, [])

	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic)
	}

	bestCar = cars.find((car) => car.y == Math.min(...cars.map((m) => m.y)))

	mainCanvas.height = window.innerHeight
	networkCanvas.height = window.innerHeight

	mainCtx.save()
	mainCtx.translate(0, -bestCar.y + mainCanvas.height * 0.7)
	road.draw(mainCtx)
	for (let i = 0; i < traffic.length; i++) traffic[i].draw(mainCtx, 'black')

	mainCtx.globalAlpha = 0.2
	for (let i = 0; i < cars.length; i++) {
		cars[i].draw(mainCtx, 'blue')
	}
	mainCtx.globalAlpha = 1
	bestCar.draw(mainCtx, 'blue', true)
	mainCtx.restore()

	networkCtx.lineDashOffset = -time / 50
	Visualizer.drawNetwork(networkCtx, bestCar.brain)

	requestAnimationFrame(animate)
}
