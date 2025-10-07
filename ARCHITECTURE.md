# 🏗️ CarAI Architecture

## Project Structure

```
src/
├── types/                    # Type definitions
│   └── index.ts             # Shared TypeScript interfaces and types
│
├── core/                    # Core simulation entities
│   ├── Car.ts               # Car entity with physics and AI
│   ├── Controls.ts          # Input handling (keyboard/AI)
│   ├── Road.ts              # Road rendering and lane management
│   ├── Sensor.ts            # Ray-casting sensors for obstacle detection
│   └── index.ts             # Barrel export
│
├── ai/                      # Artificial Intelligence
│   └── NeuralNetwork.ts     # Neural network implementation
│
├── rendering/               # Visualization
│   └── Visualizer.ts        # Neural network visualization
│
├── simulation/              # Simulation management
│   ├── SimulationState.ts   # State management with getters/setters
│   └── TrafficGenerator.ts  # Traffic pattern generation
│
├── ui/                      # User Interface
│   ├── UIManager.ts         # DOM manipulation and UI updates
│   └── StorageManager.ts    # LocalStorage persistence
│
├── utils/                   # Utilities
│   ├── geometry.ts          # Math and geometry functions
│   ├── constants.ts         # Configuration constants
│   └── index.ts             # Barrel export
│
├── main.ts                  # Application entry point
└── style.css                # Styling
```

## Design Patterns

### 1. **State Pattern**

- `SimulationStateManager` encapsulates all simulation state
- Provides controlled access through getters/setters
- Single source of truth for simulation data

### 2. **Manager Pattern**

- `UIManager`: Handles all DOM interactions
- `StorageManager`: Manages localStorage operations
- `TrafficGenerator`: Creates traffic patterns

### 3. **Interface Segregation**

- Interfaces in `types/index.ts` define contracts
- Classes implement only relevant interfaces
- Type-safe across the entire codebase

### 4. **Separation of Concerns**

- **Core**: Business logic (Car, Road, Sensor, Controls)
- **AI**: Neural network and learning algorithms
- **UI**: User interface and presentation
- **Simulation**: State and orchestration
- **Rendering**: Visualization logic

## Data Flow

```
User Input → UIManager → SimulationState → Core Classes
                ↓                           ↓
         StorageManager              NeuralNetwork
                                           ↓
                                    Sensor → Car
                                           ↓
                                      Visualizer
```

## Key Components

### Neural Network

- **Architecture**: 7 inputs (sensors) → 6 hidden → 4 outputs (WASD)
- **Learning**: Genetic algorithm with mutation
- **Activation**: Binary threshold function

### Car Entity

- **Physics**: Acceleration, friction, angular movement
- **AI Control**: Neural network outputs → boolean controls
- **Collision**: Polygon-based intersection detection

### Genetic Algorithm

1. Generate 100 random cars
2. Run simulation until generation complete
3. Select best car (fitness = distance traveled)
4. Clone best brain with mutations (5% mutation rate)
5. Repeat

### Sensors

- **Ray Casting**: 7 rays spread in front of car
- **Detection**: Road borders + traffic obstacles
- **Input**: Normalized distance readings → Neural network

## Configuration

All constants centralized in `utils/constants.ts`:

- `SIMULATION_CONFIG`: Core simulation parameters
- `CANVAS_CONFIG`: Canvas dimensions
- `CAR_CONFIG`: Car specifications
- `COLORS`: Color scheme

## Type Safety

Full TypeScript coverage with:

- Strict mode enabled
- Interface contracts for all major classes
- Type guards for runtime safety
- Generic types where applicable

## State Management

`SimulationStateManager` manages:

- Pause/resume state
- Simulation speed (0.5x to 5x)
- Generation counter
- Stuck detection
- Auto-restart logic

## Persistence

`StorageManager` handles:

- Best brain serialization (JSON)
- Generation number tracking
- Load/save/clear operations
- Error handling

## Performance Optimizations

1. **Car Culling**: Remove cars too far from best car
2. **Traffic Teleportation**: Reuse traffic cars
3. **Simulation Speed**: Skip frames for faster training
4. **Render Optimization**: Transparent bulk render + opaque best car

## Future Enhancements

### Ready to Implement:

- [ ] Chart.js integration for performance metrics
- [ ] Export/Import brain functionality
- [ ] Real-time parameter tuning
- [ ] Multiple traffic patterns
- [ ] Replay system
- [ ] Performance benchmarks

### Architecture Supports:

- ✅ Easy testing (separated concerns)
- ✅ Multiple simulation instances
- ✅ Plugin system for new features
- ✅ Different AI algorithms
- ✅ Custom training scenarios

## Dependencies

```json
{
	"vite": "^7.1.9", // Build tool with HMR
	"typescript": "^5.7.3", // Type safety
	"@types/node": "^22.10.2" // Node types for TS
}
```

## Build & Development

```bash
npm run dev      # Development server with HMR
npm run build    # Production build with type checking
npm run preview  # Preview production build
```

## Code Quality

- **No any types**: Full type coverage
- **No console.error**: Proper error handling
- **No magic numbers**: Constants defined
- **Clear naming**: Self-documenting code
- **Single responsibility**: Each class has one job

---

**Last Updated**: January 2025  
**TypeScript Version**: 5.7.3  
**Architecture Pattern**: Layered + Manager + State
