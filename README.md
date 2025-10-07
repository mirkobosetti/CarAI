# 🚗 CarAI - Self-Driving Car Simulation

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)

A self-driving car simulation powered by **neural networks** and **genetic algorithms**. Watch as cars learn to navigate traffic autonomously through reinforcement learning!

## ✨ Features

- 🧠 **Neural Network AI** - Cars use a feedforward neural network to make driving decisions
- 🧬 **Genetic Algorithm** - The best performing cars are selected and mutated to create better generations
- 📊 **Live Network Visualization** - See the neural network in action in real-time
- 🎮 **Interactive Controls** - Save and discard the best performing brain
- 🚦 **Dynamic Traffic** - Navigate through procedurally generated traffic patterns
- 👀 **Visual Sensors** - Cars use ray-casting sensors to detect obstacles

## 🎯 How It Works

1. **Sensors**: Each car has 7 ray-casting sensors that detect distances to obstacles
2. **Neural Network**: Sensor data is fed into a neural network (7 inputs → 6 hidden → 4 outputs)
3. **Control Outputs**: Network outputs control car movements (forward, left, right, backward)
4. **Fitness Function**: Cars that travel furthest without crashing are considered "best"
5. **Mutation**: The best car's brain is saved and mutated to create the next generation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

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

The simulation will open automatically in your browser at `http://localhost:3000`

## 📦 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🎮 Controls

- **💾 Save Button** - Save the current best performing neural network to localStorage
- **🗑️ Discard Button** - Clear saved neural network and start fresh

## 🏗️ Project Structure

```
CarAI/
├── src/
│   ├── classes/
│   │   ├── car.js        # Car entity with physics and collision
│   │   ├── controls.js   # Input controls (keyboard/AI)
│   │   ├── network.js    # Neural network implementation
│   │   ├── road.js       # Road rendering and lane logic
│   │   ├── sensors.js    # Ray-casting sensor system
│   │   ├── utils.js      # Helper functions
│   │   └── visualizer.js # Neural network visualization
│   ├── main.js           # Main simulation loop
│   └── style.css         # Styling
├── index.html            # Entry point
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🧪 Training Process

1. Start the simulation - 100 cars will spawn with random neural networks
2. Let them run - the best performing car (travels furthest) is highlighted
3. Click **💾 Save** when you find a good performer
4. Refresh the page - all cars will start with mutations of the saved brain
5. Repeat steps 2-4 to continuously improve performance

## 🛠️ Technologies

- **Vanilla JavaScript** (ES6+ modules)
- **Canvas API** for rendering
- **Vite** for fast development and building
- **ESLint & Prettier** for code quality

## 📊 Neural Network Architecture

```
Input Layer:    7 neurons (sensor readings)
Hidden Layer:   6 neurons
Output Layer:   4 neurons (up, left, right, down)

Activation:     Step function (binary output)
Training:       Genetic algorithm with mutation
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mirko Bosetti**

- GitHub: [@mirkobosetti](https://github.com/mirkobosetti)

## 🙏 Acknowledgments

Inspired by the fascinating field of neuroevolution and self-driving car technology.

---

**Enjoy watching the cars learn to drive!** 🚗💨
