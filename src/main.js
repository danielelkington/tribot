import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
const component = app.mount('#app')

// Global variables
let gameInProgress = true
let obstacleAhead = false
let obstacleBehind = false

// Global functions
function moveForward() {
  component.move('forward')
}

function moveBackward() {
  component.move('backward')
}

function turnLeft() {
  component.turn('left')
}

function turnRight() {
  component.turn('right')
}

function changeColor(color) {
  component.changeColor(color)
}

function beep() {
  component.beep()
}


// TODO:
// - Bundle
// - Push to npm
// - Test