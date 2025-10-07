import './style.css'
import { Car } from './classes/car.js'
import { Road } from './classes/road.js'
import { NeuralNetwork } from './classes/network.js'
import { Visualizer } from './classes/visualizer.js'

const mainCanvas = document.getElementById('mainCanvas')
const networkCanvas = document.getElementById('networkCanvas')

const LANE_NUMBER = 3

mainCanvas.width = (LANE_NUMBER * 200) / 3
networkCanvas.width = 1000

const mainCtx = mainCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9, LANE_NUMBER)

//single car
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 2)

const CARS_NUMBER = 100
let cars = generateCars(CARS_NUMBER)

const traffic = Car.generateTrainingTraffic(road)
let bestCar = cars[0]

if (localStorage.getItem('bestBrain')) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
		// '{"levels":[{"inputs":[0.09764936386930201,0,0,0,0.00041374638894509097,0.47240345819951646,0.6242288176614202],"outputs":[0,0,0,0,1,0],"biases":[0.24212929486190507,0.18592749224026311,0.013792745206689563,0.16663806125260294,-0.26207731579783855,-0.15040056913462055],"weights":[[0.010613551983208291,-0.028507769282051607,-0.0026395975482612286,-0.07363031246418299,0.2085665519606857,0.07005309009881647],[-0.04026178908493407,-0.006333515667094697,-0.14151438596195468,0.035442374054057875,0.07309879159874791,0.060673097286006214],[0.1428651311140286,0.016388117957291795,-0.06805888456512216,0.06682609795642011,-0.10923097704524865,0.059236417044965885],[0.045504308099139454,-0.016240276854901772,0.3112407233333609,-0.18459223387740978,-0.25674502905272345,-0.03926902305834818],[0.3024693158183226,-0.0650123686925858,-0.2456829975983251,0.10305935228514657,0.1454102896250556,-0.1734427108723822],[-0.267198284583658,0.08936242511284626,0.1576685264265242,-0.03495580893502688,0.1444080256948702,-0.4433295021164399],[0.2873948836795747,0.11229882369867156,-0.11815759888824298,-0.07495523187248714,0.028214202043506012,0.06745200620125527]]},{"inputs":[0,0,0,0,1,0],"outputs":[1,1,0,0],"biases":[-0.17479432796057123,0.09435697474044329,0.030344765993626916,0.00594017232825788],"weights":[[0.042395473762716074,0.055062930349392025,-0.03707861910932077,0.2312705614040806],[0.256039114085133,-0.29227228431716956,-0.22414676718984874,-0.09101066226868176],[-0.24427387592178687,0.12509936602652988,-0.08145749736130534,0.05300053655926726],[-0.037212346553172584,0.08081821027306457,-0.09530821848719755,-0.1072901561814697],[0.14990574428693312,0.16706033020270467,-0.026252257140039925,-0.2275646549240563],[0.24554685241164276,-0.08028838949214231,0.17599993973324135,0.04836117274964141]]}]}'

		// for all the cars except the best one
		if (i != 0) {
			NeuralNetwork.mutate(cars[i].brain, 0.05)
		}
	}
}

animate()

// Expose functions globally for buttons
window.save = save
window.discard = discard

function save() {
	localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
	localStorage.removeItem('bestBrain')
}

function generateCars(n) {
	const cars = []
	for (let i = 0; i < n; i++) {
		cars.push(new Car(i, road.getLaneCenter(1), 100, 30, 50, 'AI', 4))
	}
	return cars
}

function animate(time) {
	for (let i = 0; i < traffic.length; i++) traffic[i].update(road.borders, [])

	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic)
	}

	// fitness - trova la macchina migliore
	bestCar = cars.find((car) => car.y == Math.min(...cars.map((m) => m.y)))

	// Rimuovi le auto troppo lontane dalla bestCar
	cars = cars.filter((car) => {
		// Se la macchina è troppo lontana dalla migliore, rimuovila
		if (car.y > bestCar.y + mainCanvas.height / 2 && !car.damaged) {
			return false
		}
		// Se è danneggiata e non è mai stata la migliore, rimuovila
		if (car.damaged && !car.wasBest) {
			return false
		}
		return true
	})

	// Segna la macchina migliore
	cars.forEach(car => {
		if (car.id === bestCar.id) {
			car.wasBest = true
		}
	})

	// Se tutte le auto rimanenti sono danneggiate e sono state la migliore, salva e ricarica
	if (cars.length > 0 && cars.every(car => car.damaged && car.wasBest)) {
		save()
		window.location.reload()
		return
	}

	mainCanvas.height = window.innerHeight
	networkCanvas.height = window.innerHeight

	mainCtx.save()
	mainCtx.translate(0, -bestCar.y + mainCanvas.height * 0.7)
	road.draw(mainCtx)
	for (let i = 0; i < traffic.length; i++) {
		//if the car is outside the visible area, teleport it forwards
		if (traffic[i].y > bestCar.y + window.innerHeight) {
			traffic[i].y -= 4 * window.innerHeight
			traffic[i].x = road.getLaneCenter(Math.floor(Math.random() * LANE_NUMBER))
		}
		traffic[i].draw(mainCtx, 'black')
	}

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
