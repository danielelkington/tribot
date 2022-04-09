import { createApp } from 'vue'
import App from './App.vue'

// Create a div in the DOM for our Vue app
const d = document.createElement('div')
d.id = 'app'
document.body.appendChild(d)

const app = createApp(App)
const component = app.mount('#app')

// Global variables
window.gameInProgress = true
window.obstacleAhead = false
window.obstacleBehind = false
window.S = 'S' // Start
window.W = 'W' // Wall
window.T = 'T' // Treasure
window._ = '_' // Nothing
window.P = 'P' // Player

// Global functions
window.moveForward = function() {
  component.move('forward')
}

window.moveBackward = function() {
  component.move('backward')
}

window.turnLeft = function() {
  component.turn('left')
}

window.turnRight = function() {
  component.turn('right')
}

window.changeColor = function(color) {
  component.changeColor(color)
}

window.beep = function() {
  component.beep()
}

window.setRoom = function(roomNumberOrRoomPattern) {
  component.setRoom(roomNumberOrRoomPattern)
}

// TODO:
// - Allow extra rooms to be added
// - Push to npm
// - README, License
// -GitHub