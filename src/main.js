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

window.setRoom = function(roomNumber) {
  component.setRoom(roomNumber)
}

// TODO:
// - Allow extra rooms to be added
// - Push to npm
// - README, License
// -GitHub