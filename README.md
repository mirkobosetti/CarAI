# 🚗 CarAI - Self-Driving Car Simulation

![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)
![Neural Network](https://img.shields.io/badge/Neural_Network-AI-orange)

A sophisticated self-driving car simulation powered by **neural networks** and **genetic algorithms**. Watch as 100 AI-controlled cars learn to navigate traffic, avoid obstacles, and improve their driving skills through evolutionary learning.

## 🎥 Demo

https://github.com/user-attachments/assets/demo.mov

_Watch 100 AI cars evolve their driving skills through genetic algorithms and neural networks_

## ✨ Features

### 🧠 Neural Network Architecture

- **7 input neurons**: Ray-casting sensor data for obstacle detection
- **6 hidden neurons**: Pattern recognition layer
- **4 output neurons**: Control signals (forward, left, right, backward)
- **Feed-forward network**: Real-time decision making at 60 FPS

### 🧬 Genetic Algorithm

- **Population size**: 100 cars per generation
- **Selection**: Best performing car's brain is saved
- **Mutation**: 5% mutation rate for genetic diversity
- **Evolution**: Automatic generation progression

### 🎯 Advanced Features

- **Ray-casting sensors**: 7 rays with 200px detection range
- **Real-time visualization**: Neural network activity display
- **Traffic simulation**: Dynamic obstacle generation
- **Auto-save**: Best brain persists across sessions
- **Performance tracking**: Distance, generation, and stats display
- **Pause/Resume**: Full simulation control
- **Speed control**: 1x, 2x, 5x simulation speeds

### 🏗️ Clean Architecture

- **TypeScript**: 100% type coverage with strict mode
- **Modular design**: 7-layer architecture (types, core, ai, rendering, simulation, ui, utils)
- **Design patterns**: State pattern, Manager pattern, Dependency injection
- **Professional structure**: Organized codebase following best practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mirkobosetti/CarJS.git
cd CarJS

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Use

### Controls

- **Save (💾)**: Save the best car's brain to localStorage
- **Discard (🗑️)**: Clear saved brain and restart from generation 1
- **Pause (⏸️)**: Pause/resume the simulation
- **Speed**: Control simulation speed (1x, 2x, 5x)

### Training Process

1. **Initial Generation**: 100 cars start with random neural networks
2. **Evolution**: Cars navigate the road avoiding traffic
3. **Selection**: Best performing car is identified by distance traveled
4. **Save**: Click save to preserve the best brain
5. **Next Generation**: Cars spawn with mutations of the best brain
6. **Iteration**: Process repeats, gradually improving performance

### Tips

- Let the simulation run for 10-20 generations for noticeable improvement
- Save frequently to preserve good brains
- Use 5x speed to accelerate training
- Watch the neural network visualization to see decision-making in real-time

## 🏛️ Architecture

```
src/
├── types/           # TypeScript interfaces and types
├── core/            # Core entities (Car, Road, Sensor, Controls)
├── ai/              # Neural Network implementation
├── rendering/       # Visualization (Network display)
├── simulation/      # State management and traffic generation
├── ui/              # UI controls and storage management
├── utils/           # Constants and utility functions
└── main.ts          # Application entry point
```

### Key Components

#### 🚗 Car (`src/core/Car.ts`)

- Physics simulation (velocity, acceleration, friction)
- Collision detection with road borders and traffic
- Neural network integration
- Ray-casting sensor system

#### 🧠 Neural Network (`src/ai/NeuralNetwork.ts`)

- Feed-forward propagation
- Genetic mutation algorithm
- Deep cloning for independent instances
- Bias and weight randomization

#### 📡 Sensor (`src/core/Sensor.ts`)

- 7 ray-casting sensors (180° spread)
- Real-time obstacle detection
- Distance offset calculation
- Visual debugging

#### 🎨 Visualizer (`src/rendering/Visualizer.ts`)

- Real-time neural network visualization
- Connection strength representation
- WASD control mapping display
- Color-coded activation states

## 📊 Neural Network Details

### Input Layer (7 neurons)

Each neuron receives normalized distance (0-1) from ray-casting sensors:

- 7 rays spread across 180° field of view
- Detection range: 200 pixels
- Value: `1 - (distance / maxDistance)`

### Hidden Layer (6 neurons)

- Processes sensor patterns
- Applies weights and biases
- Activation function: Step function (threshold-based)

### Output Layer (4 neurons)

Control signals for the car:

- **[0]**: Forward (accelerate)
- **[1]**: Left (turn left)
- **[2]**: Right (turn right)
- **[3]**: Backward (brake/reverse)

### Mutation Strategy

```typescript
mutatedValue = lerp(currentValue, randomValue, 0.05)
```

- 5% interpolation between current and random value
- Balances exploration vs exploitation
- Preserves learned behaviors while allowing innovation

## 🛠️ Technologies

- **TypeScript 5.7.3**: Type-safe development
- **Vite 7.1.9**: Lightning-fast build tool
- **HTML5 Canvas**: High-performance rendering
- **LocalStorage API**: Brain persistence
- **ES Modules**: Modern JavaScript architecture

## 📈 Performance

- **60 FPS**: Consistent frame rate
- **100 cars**: Simultaneous AI processing
- **Real-time**: Neural network evaluation every frame
- **Optimized**: Canvas rendering with efficient drawing

## 🎓 Learning Concepts

This project demonstrates:

- **Neural Networks**: Feed-forward architecture
- **Genetic Algorithms**: Evolution through selection and mutation
- **Machine Learning**: Supervised learning without explicit training data
- **Ray Casting**: Sensor simulation for AI perception
- **Collision Detection**: Polygon intersection algorithms
- **State Management**: Clean architecture patterns

## 📝 License

MIT License - feel free to use this project for learning or your own portfolio!

## 👨‍💻 Author

**Mirko Bosetti**

- GitHub: [@mirkobosetti](https://github.com/mirkobosetti)

## 🙏 Acknowledgments

Inspired by the fascinating world of neural networks and genetic algorithms. This project showcases how simple rules can lead to emergent intelligent behavior.

---

⭐ **Star this repo** if you find it interesting or useful for learning about AI and neural networks!
