<script setup>
import { computed } from '@vue/reactivity';
import {ref, reactive} from 'vue'
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
  ]
  // Room 2
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
const playerCurrentState = computed(() => playerStates[playerStateIndex.value])
const playerLastState = computed(() => playerStates[playerStates.length - 1])
const playerPosition = computed(() => playerCurrentState.value.position)
const playerFacing = computed(() => playerCurrentState.value.facing)
const playerColour = computed(() => playerCurrentState.value.colour)
const rotatePlayer = computed(() => {
  switch(playerFacing.value) {
    case 'left': return 0;
    case 'up': return 90;
    case 'right': return 180;
    case 'down': return 270;
  }
})

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

// TODO - when we run through the code, generate new states, then 
// gradually move through each state to play the game.
// Try to animate the player!

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
        newState.won = true
        gameInProgress = false
      }
      playerStates.push(newState)
    }
  }
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
  if (playerStateIndex.value < playerStates.length - 1) {
    playerStateIndex.value++
    console.log(playerCurrentState.value.position)
  }
}, 1000)
</script>

<template>
<div class="container">
  <div class="room" :style="{
    'grid-template-columns': 'repeat( ' + selectedRoom[0].length + ', 1fr)',
    'grid-template-rows': 'repeat(' + selectedRoom.length + ', 1fr)'
    }">
    <div class="room-element" v-for="(element, i) in flattenedRoomElements" :key="i">
      <svg v-if="element === 'P'" class="player" viewBox="0 0 500 500"
        :style="{'transform': 'rotate(' + rotatePlayer + 'deg)'}">
        <polygon points="0,250 500,40 500,460" :style="{fill:playerColour}" />
      </svg>
      <Wall v-if="element === 'W'" class="wall"/>
      <Treasure v-if="element === 'T'" class="treasure"/>
    </div>
  </div>
  {{playerStates}}
</div>
</template>

<style>
body {
  margin: 0;
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
}

/*Player*/
.player {
  width: 80%;
  height: 80%;
  margin: 10%;
  transform: rotate(0deg);
}

.player > polygon {
  stroke:black;
  stroke-width:2;
}

.wall, .treasure {
  width: 90%;
  height: 90%;
  margin: 5%;
}
</style>
