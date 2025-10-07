import './style.css'
import { Car } from './classes/car'
import { Road } from './classes/road'
import { NeuralNetwork } from './classes/network'
import { Visualizer } from './classes/visualizer'

const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const networkCanvas = document.getElementById('networkCanvas') as HTMLCanvasElement

const LANE_NUMBER = 3

mainCanvas.width = (LANE_NUMBER * 200) / 3
networkCanvas.width = 400 // Increased for better aspect ratio

const mainCtx = mainCanvas.getContext('2d')!
const networkCtx = networkCanvas.getContext('2d')!

const road = new Road(mainCanvas.width / 2, mainCanvas.width * 0.9, LANE_NUMBER)

// Simulation state
let isPaused = false
let simulationSpeed = 1
let generation = parseInt(localStorage.getItem('generation') || '1')
let maxDistance = 0
let startTime = Date.now()
let lastBestCarY = 0
let stuckFrameCount = 0
let resetPending = false // Flag per evitare reset multipli in coda
const STUCK_THRESHOLD = 300 // frames senza progressi prima del reset (circa 5 secondi a 60fps)
const MIN_PROGRESS = 5 // distanza minima di progresso richiesta

const CARS_NUMBER = 100
let cars = generateCars(CARS_NUMBER)

let traffic = Car.generateTrainingTraffic(road)
let bestCar = cars[0]!

// UI Elements
const activeCarsEl = document.getElementById('activeCars')!
const generationEl = document.getElementById('generation')!
const bestDistanceEl = document.getElementById('bestDistance')!
const bestSpeedEl = document.getElementById('bestSpeed')!
const brainStatusEl = document.getElementById('brainStatus')!
const statusIndicatorEl = document.getElementById('statusIndicator')!
const statusTextEl = document.getElementById('statusText')!
const pauseBtn = document.getElementById('pauseBtn')!
const resetBtn = document.getElementById('resetBtn')!
const saveBtn = document.getElementById('saveBtn')!
const discardBtn = document.getElementById('discardBtn')!
const speedButtons = document.querySelectorAll('.btn-speed') as NodeListOf<HTMLButtonElement>

// Load saved brain if exists
if (localStorage.getItem('bestBrain')) {
	for (let i = 0; i < cars.length; i++) {
		cars[i]!.brain = JSON.parse(localStorage.getItem('bestBrain')!)

		// for all the cars except the best one
		if (i != 0) {
			NeuralNetwork.mutate(cars[i]!.brain!, 0.1)
		}
	}
	updateBrainStatus(true)
} else {
	updateBrainStatus(false)
}

// Event Listeners
pauseBtn.addEventListener('click', togglePause)
resetBtn.addEventListener('click', reset)
saveBtn.addEventListener('click', save)
discardBtn.addEventListener('click', discard)

speedButtons.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		const speed = parseFloat((e.target as HTMLButtonElement).dataset.speed!)
		setSimulationSpeed(speed)
	})
})

// Initialize UI
generationEl.textContent = generation.toString()
updateStats()

animate()

function togglePause(): void {
	isPaused = !isPaused
	const pauseIcon = document.getElementById('pauseIcon')!
	const pauseText = document.getElementById('pauseText')!

	if (isPaused) {
		pauseIcon.textContent = '▶️'
		pauseText.textContent = 'Resume'
	} else {
		pauseIcon.textContent = '⏸️'
		pauseText.textContent = 'Pause'
	}
}

function setSimulationSpeed(speed: number): void {
	simulationSpeed = speed
	speedButtons.forEach((btn) => {
		btn.classList.toggle('active', parseFloat(btn.dataset.speed!) === speed)
	})
}

function reset(): void {
	resetPending = false // Rilascia il flag SUBITO all'inizio

	cars = generateCars(CARS_NUMBER)
	traffic = Car.generateTrainingTraffic(road)
	bestCar = cars[0]!
	maxDistance = 0
	startTime = Date.now()
	lastBestCarY = bestCar.y // Inizializza con la posizione di partenza della bestCar
	stuckFrameCount = 0

	// Reset status indicator
	statusIndicatorEl.classList.remove('stuck')
	statusIndicatorEl.style.borderLeftColor = ''
	statusTextEl.classList.remove('stuck')
	statusTextEl.style.color = ''
	statusTextEl.textContent = '✅ Running'

	if (localStorage.getItem('bestBrain')) {
		for (let i = 0; i < cars.length; i++) {
			cars[i]!.brain = JSON.parse(localStorage.getItem('bestBrain')!)
			if (i != 0) {
				NeuralNetwork.mutate(cars[i]!.brain!, 0.05)
			}
		}
	}

	generation++
	localStorage.setItem('generation', generation.toString())
	generationEl.textContent = generation.toString()

	if (isPaused) {
		togglePause()
	}
}

function save(): void {
	localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
	updateBrainStatus(true)

	// Show feedback
	saveBtn.textContent = '✅ Saved!'
	setTimeout(() => {
		saveBtn.innerHTML = '💾 Save Best Brain'
	}, 2000)
}

function discard(): void {
	if (resetPending) return // Evita reset durante un reset in corso

	localStorage.removeItem('bestBrain')
	localStorage.removeItem('generation')
	generation = 1
	generationEl.textContent = generation.toString()
	updateBrainStatus(false)

	// Show feedback
	discardBtn.textContent = '✅ Discarded!'
	setTimeout(() => {
		discardBtn.innerHTML = '🗑️ Discard Saved'
	}, 2000)

	// Reset with new random brains
	resetPending = true
	setTimeout(reset, 500)
}

function updateBrainStatus(hasBrain: boolean): void {
	if (hasBrain) {
		brainStatusEl.textContent = '✅ Brain loaded'
		brainStatusEl.style.color = 'var(--accent-green)'
	} else {
		brainStatusEl.textContent = 'No saved brain'
		brainStatusEl.style.color = 'var(--text-secondary)'
	}
}

function updateStats(): void {
	const aliveCars = cars.filter((car) => !car.damaged).length
	activeCarsEl.textContent = aliveCars.toString()

	const distance = Math.abs(Math.round(bestCar.y / 10))
	if (distance > maxDistance) {
		maxDistance = distance
	}
	bestDistanceEl.textContent = `${maxDistance}m`

	const speed = Math.abs(Math.round(bestCar.speed * 50))
	bestSpeedEl.textContent = speed.toString()
}

function generateCars(n: number): Car[] {
	const cars: Car[] = []
	for (let i = 0; i < n; i++) {
		cars.push(new Car(i, road.getLaneCenter(1), 100, 30, 50, 'AI', 4))
	}
	return cars
}

function animate(time?: number): void {
	// Apply simulation speed and pause
	if (!isPaused) {
		for (let speedStep = 0; speedStep < simulationSpeed; speedStep++) {
			for (let i = 0; i < traffic.length; i++) {
				traffic[i].update(road.borders, [])
			}

			for (let i = 0; i < cars.length; i++) {
				cars[i].update(road.borders, traffic)
			}

			// fitness - trova la macchina migliore
			const foundBestCar = cars.find((car) => car.y == Math.min(...cars.map((m) => m.y)))
			if (foundBestCar) {
				bestCar = foundBestCar
			}

			// Controlla se le auto sono bloccate/ferme
			const currentProgress = Math.abs(bestCar.y - lastBestCarY)

			if (currentProgress < MIN_PROGRESS) {
				stuckFrameCount++

				// Aggiorna UI per mostrare che le auto sono bloccate
				if (stuckFrameCount > 60) {
					// Mostra dopo 1 secondo
					statusIndicatorEl.classList.add('stuck')
					statusTextEl.classList.add('stuck')
					statusTextEl.textContent = '⚠️ Stuck'
				}
			} else {
				stuckFrameCount = 0
				lastBestCarY = bestCar.y

				// Reset UI
				statusIndicatorEl.classList.remove('stuck')
				statusTextEl.classList.remove('stuck')
				statusTextEl.textContent = '✅ Running'
			}

			// Se le auto sono ferme per troppo tempo, reset automatico
			if (stuckFrameCount >= STUCK_THRESHOLD && !resetPending) {
				resetPending = true // Setta SUBITO per evitare duplicati
				console.log('🚗 Auto bloccate rilevate - Auto restart in 500ms...')
				save()
				setTimeout(reset, 500)
				// NON fare return qui, continua l'animazione
			} // Rimuovi le auto troppo lontane dalla bestCar
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
			cars.forEach((car) => {
				if (car.id === bestCar.id) {
					car.wasBest = true
				}
			})
		}

		// Controlla se tutte le auto sono ferme o danneggiate (fuori dal loop speedStep)
		const aliveCars = cars.filter((car) => !car.damaged)
		const allCarsStuck = aliveCars.length > 0 && aliveCars.every((car) => Math.abs(car.speed) < 0.1)
		const allCarsDamaged = aliveCars.length === 0 // Nessuna auto viva = tutte danneggiate

		// Aggiorna UI se tutte le auto vive sono ferme
		if (allCarsStuck && aliveCars.length > 0) {
			statusIndicatorEl.classList.add('stuck')
			statusTextEl.classList.add('stuck')
			statusTextEl.textContent = '⏳ Finishing'
		}

		// Se tutte le auto sono danneggiate O tutte le auto vive sono ferme per un po'
		if ((allCarsDamaged || (allCarsStuck && stuckFrameCount > 120)) && !resetPending) {
			resetPending = true // Setta SUBITO per evitare duplicati
			console.log('🏁 Generazione completata - Passaggio alla prossima in 1s...')
			console.log(`📊 Migliore distanza: ${Math.abs(Math.round(bestCar.y / 10))}m`)
			console.log(`🚗 Auto vive: ${aliveCars.length}`)

			// Mostra feedback
			statusIndicatorEl.classList.remove('stuck')
			statusIndicatorEl.style.borderLeftColor = 'var(--accent-green)'
			statusTextEl.classList.remove('stuck')
			statusTextEl.style.color = 'var(--accent-green)'
			statusTextEl.textContent = '✅ Gen Done'

			save()
			setTimeout(reset, 1000)
			// NON fare return qui, continua l'animazione
		}
	}

	// Update statistics
	updateStats()

	mainCanvas.height = window.innerHeight - 120 // Account for header
	networkCanvas.height = 500 // Increased height for better visualization

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

	networkCtx.lineDashOffset = time ? -time / 50 : 0
	Visualizer.drawNetwork(networkCtx, bestCar.brain!)

	requestAnimationFrame(animate)
}
