/**
 * Shared types for the CarAI simulation
 */

// ============================================================================
// Geometry Types
// ============================================================================

export interface Point {
	x: number
	y: number
}

export interface Intersection extends Point {
	offset: number
}

// ============================================================================
// Control Types
// ============================================================================

export type ControlType = 'KEYS' | 'DUMMY' | 'AI'

export interface IControls {
	left: boolean
	right: boolean
	up: boolean
	down: boolean
}

// ============================================================================
// Neural Network Types
// ============================================================================

export interface NetworkLevel {
	inputs: number[]
	outputs: number[]
	biases: number[]
	weights: number[][]
}

export interface INeuralNetwork {
	levels: NetworkLevel[]
}

// ============================================================================
// Sensor Types
// ============================================================================

export interface SensorReading extends Intersection {}

export interface ISensor {
	car: ICar
	rayCount: number
	rayLength: number
	raySpread: number
	rays: [Point, Point][]
	readings: (SensorReading | null)[]
	update(roadBorders: [Point, Point][], traffic: ICar[]): void
	draw(ctx: CanvasRenderingContext2D): void
}

// ============================================================================
// Car Types
// ============================================================================

export interface ICar {
	id: number | undefined
	x: number
	y: number
	width: number
	height: number
	speed: number
	acceleration: number
	maxForwardSpeed: number
	maxBackwardSpeed: number
	friction: number
	angle: number
	damaged: boolean
	wasBest: boolean
	useBrain: boolean
	sensor?: ISensor
	brain?: INeuralNetwork
	controls: IControls
	polygon: Point[]
	update(roadBorders: [Point, Point][], traffic: ICar[]): void
	draw(ctx: CanvasRenderingContext2D, color: string, showSensors?: boolean): void
}

// ============================================================================
// Road Types
// ============================================================================

export interface IRoad {
	x: number
	width: number
	lanes: number
	left: number
	right: number
	top: number
	bottom: number
	borders: [Point, Point][]
	getLaneCenter(laneIndex: number): number
	draw(ctx: CanvasRenderingContext2D): void
}

// ============================================================================
// Simulation Types
// ============================================================================

export interface SimulationState {
	isPaused: boolean
	simulationSpeed: number
	generation: number
	maxDistance: number
	startTime: number
	lastBestCarY: number
	stuckFrameCount: number
	resetPending: boolean
}

export interface SimulationConfig {
	readonly LANE_NUMBER: number
	readonly CARS_NUMBER: number
	readonly STUCK_THRESHOLD: number
	readonly MIN_PROGRESS: number
	readonly NETWORK_ARCHITECTURE: number[]
	readonly MUTATION_RATE: number
}

// ============================================================================
// UI Types
// ============================================================================

export interface UIElements {
	activeCars: HTMLElement
	generation: HTMLElement
	bestDistance: HTMLElement
	bestSpeed: HTMLElement
	brainStatus: HTMLElement
	statusIndicator: HTMLElement
	statusText: HTMLElement
	pauseBtn: HTMLElement
	resetBtn: HTMLElement
	saveBtn: HTMLElement
	discardBtn: HTMLElement
	speedButtons: NodeListOf<HTMLButtonElement>
}

export interface CanvasElements {
	mainCanvas: HTMLCanvasElement
	networkCanvas: HTMLCanvasElement
	mainCtx: CanvasRenderingContext2D
	networkCtx: CanvasRenderingContext2D
}

// ============================================================================
// Storage Types
// ============================================================================

export interface StorageKeys {
	BEST_BRAIN: 'bestBrain'
	GENERATION: 'generation'
}

export interface SavedBrain {
	levels: NetworkLevel[]
}
