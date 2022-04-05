<script setup>
import { computed } from '@vue/reactivity';
import {ref, reactive} from 'vue'
import Wall from './Wall.vue'
const S = 'S'
const W = 'W'
const T = 'T'
const _ = '_'
const P = 'P'
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
const playerPosition = ref(getPositionOf(S))
const playerFacing = ref('right') // right, left, up, down
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
      if (playerPosition.value[0] === i && playerPosition.value[0] === j) {
        elements.push(P)
      } else elements.push(selectedRoom.value[i][j])
    }
  }
  return elements
})
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
        <polygon points="0,250 500,40 500,460" style="fill:red;" />
      </svg>
      <Wall v-if="element === 'W'" class="wall"/>
    </div>
  </div>
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

.wall {
  width: 90%;
  height: 90%;
  margin: 5%;
}
</style>
