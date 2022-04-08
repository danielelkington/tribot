import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
const component = app.mount('#app')

// Global variables
let gameInProgress = true
let obstacleAhead = false
let obstacleBehind = false

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

function changeColour(colour) {
  component.changeColour(colour)
}

// turnRight()
// moveForward()
// moveForward()
// turnLeft()
// moveForward()
// moveForward()