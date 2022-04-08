<script setup>
import {ref, reactive, watch, computed} from 'vue'
import Wall from './Wall.vue'
import Treasure from './Treasure.vue'
const S = 'S' // Start
const W = 'W' // Wall
const T = 'T' // Treasure
const _ = '_' // Nothing
const P = 'P' // Player
const rooms = reactive([
  // Room 1
  [
    [S,W,_,_,_],
    [_,W,_,_,_],
    [_,_,_,W,T],
    [_,_,_,_,_]
  ],
  // Room 2
  [
    [S,_,_,_,_],
    [_,_,_,_,_],
    [_,_,_,_,_],
    [_,_,_,_,_]
  ]
])
const selectedRoom = ref(rooms[0])
function getPositionOf(thing) {
  for (let i = 0; i < selectedRoom.value.length; i++) {
    for (let j = 0; j < selectedRoom.value[i].length; j++) {
      if (selectedRoom.value[i][j] === thing) {
        return [i, j]
      }
    }
    return -1
  }
}
// State = playerPosition + playerFacing + playerColour.
const playerStates = reactive([{position: getPositionOf(S), facing: 'right', colour: 'red', collision: null}])
const playerStateIndex = ref(0)
const winningIndex = ref(null)
const playerCurrentState = computed(() => playerStates[playerStateIndex.value])
const playerLastState = computed(() => playerStates[playerStates.length - 1])
const playerPosition = computed(() => playerCurrentState.value.position)
const playerFacing = computed(() => playerCurrentState.value.facing)
const playerColour = computed(() => playerCurrentState.value.colour)
const rotatePlayer = ref(180)
watch(() => playerFacing.value, (playerFacing) => {
  // So we animate smoothly, we need to calculate the rotation
  // so that we move to the closest angle
  // eg don't go from 270deg to 0, instead go from 270 to 360.
  const multipleOf360 = Math.floor(rotatePlayer.value / 360)
  const multiplesOf360ToTry = [multipleOf360 - 1, multipleOf360, multipleOf360 + 1]
  let baseRotation
  switch(playerFacing) {
    case 'left':
      baseRotation = 0
      break
    case 'up':
      baseRotation = 90
      break
    case 'right':
      baseRotation = 180
      break
    case 'down':
      baseRotation = 270
      break
  }
  let smallestDifference = 1000
  let bestAngle = null
  for (const multipleOf360 of multiplesOf360ToTry) {
    const angle = 360 * multipleOf360 + baseRotation
    if (Math.abs(rotatePlayer.value - angle) < smallestDifference) {
      bestAngle = angle
      smallestDifference = Math.abs(rotatePlayer.value - angle)
    }
  }
  rotatePlayer.value = bestAngle
})

function updateGlobals() {
  // Need to check ahead and behind the player to see if
  // The end of the board or a wall is ahead/behind.
  const currentPosition = playerLastState.value.position
  const facing = playerLastState.value.facing
  let oneStepForward, oneStepBack
  switch(facing) {
    case 'right':
      oneStepForward = [currentPosition[0], currentPosition[1] + 1]
      oneStepBack = [currentPosition[0], currentPosition[1] - 1]
      break
    case 'up':
      oneStepForward = [currentPosition[0] - 1, currentPosition[1]]
      oneStepBack = [currentPosition[0] + 1, currentPosition[1]]
      break
    case 'down':
      oneStepForward = [currentPosition[0] + 1, currentPosition[1]]
      oneStepBack = [currentPosition[0] - 1, currentPosition[1]]
      break
    case 'left':
      oneStepForward = [currentPosition[0], currentPosition[1] - 1]
      oneStepBack = [currentPosition[0], currentPosition[1] + 1]
      break
  }
  if (oneStepForward[0] < 0 ||
    oneStepForward[0] >= selectedRoom.value.length ||
    oneStepForward[1] < 0 ||
    oneStepForward[1] >= selectedRoom.value[0].length ||
    selectedRoom.value[oneStepForward[0]][oneStepForward[1]] === W) {
      window.obstacleAhead = true
    } else {
      window.obstacleAhead = false
    }
  if (oneStepBack[0] < 0 ||
    oneStepBack[0] >= selectedRoom.value.length ||
    oneStepBack[1] < 0 ||
    oneStepBack[1] >= selectedRoom.value[0].length ||
    selectedRoom.value[oneStepBack[0]][oneStepBack[1]] === W) {
      window.obstacleBehind = true
    } else {
      window.obstacleBehind = false
    }
}

updateGlobals()

const flattenedRoomElements = computed(() => {
  const elements = []
  for (let i = 0; i < selectedRoom.value.length; i++) {
    for (let j = 0; j < selectedRoom.value[i].length; j++) {
      if (playerPosition.value[0] === i && playerPosition.value[1] === j) {
        elements.push(P)
      } else elements.push(selectedRoom.value[i][j])
    }
  }
  return elements
})

const move = function(direction) { // forward or backward
  const currentPosition = playerLastState.value.position
  const movementDirection = direction === 'forward'
    ? playerLastState.value.facing
    : (playerLastState.value.facing === 'right' ? 'left'
      : playerLastState.value.facing === 'left' ? 'right'
      : playerLastState.value.facing === 'up' ? 'down'
      : 'up'
    )
  let targetPosition
  switch(movementDirection) {
    case 'right':
      targetPosition = [currentPosition[0], currentPosition[1] + 1]
      break
    case 'up':
      targetPosition = [currentPosition[0] - 1, currentPosition[1]]
      break
    case 'down':
      targetPosition = [currentPosition[0] + 1, currentPosition[1]]
      break
    case 'left':
      targetPosition = [currentPosition[0], currentPosition[1] - 1]
  }
  // Off the board?
  if (targetPosition[0] < 0 ||
    targetPosition[0] >= selectedRoom.value.length ||
    targetPosition[1] < 0 ||
    targetPosition[1] >= selectedRoom.value[0].length) {
    playerStates.push({...playerLastState.value, collision: movementDirection})
  } else {
    const targetPositionValue = selectedRoom.value[targetPosition[0]][targetPosition[1]]
    if (targetPositionValue === W) {
      // Wall
      playerStates.push({...playerLastState.value, collision: movementDirection})
    } else {
      // Move the player
      const newState = {...playerLastState.value, position: targetPosition, collision: null}
      // Reached the treasure?
      if (targetPositionValue === T) {
        winningIndex.value = playerStates.length
        window.gameInProgress = false
      }
      playerStates.push(newState)
    }
  }
  updateGlobals()
}

const turn = function(direction) { // left or right
  let newDirection
  if (direction === 'left') {
    switch (playerLastState.value.facing) {
      case 'left':
        newDirection = 'down'
        break
      case 'up':
        newDirection = 'left'
        break
      case 'right':
        newDirection = 'up'
        break
      case 'down':
        newDirection = 'right'
        break
    } 
  } else {
    switch(playerLastState.value.facing) {
      case 'left':
        newDirection = 'up'
        break
      case 'up': 
        newDirection = 'right'
        break
      case 'right': 
        newDirection = 'down'
        break
      case 'down':
        newDirection = 'left'
        break
    }
  }
  playerStates.push({...playerLastState.value, facing: newDirection, collision: null})
  updateGlobals()
}

const changeColor = function(color) {
  playerStates.push({...playerLastState.value, colour: color})
}

defineExpose({
  move,
  turn,
  changeColor
})

setInterval(() => {
  if (playerStateIndex.value < playerStates.length - 1 &&
    (winningIndex.value == null || playerStateIndex.value < winningIndex.value)) {
    playerStateIndex.value++
  }
}, 1000)
</script>

<template>
<div class="container">
  <div class="room" :style="{
    'grid-template-columns': 'repeat( ' + selectedRoom[0].length + ', 1fr)',
    'grid-template-rows': 'repeat(' + selectedRoom.length + ', 1fr)'
    }">
    <div class="room-element"
      v-for="(element, i) in flattenedRoomElements"
      :key="i"
      :style="{
      'grid-row': Math.floor(i / selectedRoom[0].length) + 1,
      'grid-column': i % selectedRoom[0].length + 1
    }">
      <Transition>
        <div v-if="element === 'P' && playerCurrentState.collision" class="collision" :class="playerCurrentState.collision" />
      </Transition>
      <Wall v-if="element === 'W'" class="wall"/>
      <Treasure v-if="element === 'T'" class="treasure"/>
    </div>
    <!--Player moves from cell to cell-->
    <div class="player-box" :style="{
        'grid-row': playerCurrentState.position[0] + 1,
        'grid-column': playerCurrentState.position[1] + 1
        }">
      <svg class="player" viewBox="0 0 500 500"
        :style="{'transform': 'rotate(' + rotatePlayer + 'deg)'}">
        <polygon points="0,250 500,40 500,460" :style="{fill:playerColour}" />
      </svg>
    </div>
  </div>
  <Transition>
    <div v-if="winningIndex != null && playerStateIndex >= winningIndex" class="success">
      <div class="success-inner">
        <Treasure/>
        <p>You got the treasure!</p>
      </div>
    </div>
  </Transition>
</div>
</template>

<style>
body {
  margin: 0;
  overflow: hidden;
}
.container {
  width: 100vw;
  height: 100vh;
}
.room {
  display: grid;
  height: 100%;
  width: 100%;
}
.room-element {
  margin: 1px;
  border: 1px solid black;
  display: grid;
  overflow: hidden;
}

.player-box {
  align-self: center;
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.player {
  max-width: 80%;
  max-height: 80%;
  padding: 10%;
  transform: rotate(0deg);
  transition: transform 1s;
}

.player > polygon {
  stroke:black;
  stroke-width:2;
}

.collision {
  background: #a8181e;
  grid-column: 1;
  grid-row: 1;
}

.collision.right {
  width: 5px;
  justify-self: end;
}

.collision.left {
  width: 5px;
  justify-self: start;
}

.collision.up {
  width: 100%;
  height: 5px;
  align-self: start;
}

.collision.down {
  width: 100%;
  height: 5px;
  align-self: end;
}

.wall, .treasure {
  max-width: 90%;
  max-height: 90%;
  margin: 5%;
  align-self: center;
  justify-self: center;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.success {
  position: fixed;
  width: 100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
}

.success-inner {
  background: rgba(255,253,208,0.9);
  border-radius: 5px;
  padding: 20px;
}

.success-inner > p {
  font-family: sans-serif;
  font-size: larger;
}
</style>
