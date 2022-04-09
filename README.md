# Tribot
Control a triangular robot, or "Tribot", to retrieve some treasure.
Designed for teaching programming, allowing you to use real JavaScript with zero setup and as little boilerplate as possible.

## Getting started
Create a file named `index.html` on your computer with the following contents:
```html
<script type="module" src="https://unpkg.com/tribot"></script>
<script type="module">
// Your code goes here
</script>
```
Then open this file in your favourite modern browser (relatively up-to-date version of Chrome, FireFox, Safari, Edge, etc).

You should see this:
<img width="756" alt="A 5x2 grid with a red triangle in cell 1x1, a treasure box in cell 4x2 and a Start button in the centre" src="https://user-images.githubusercontent.com/20923693/162576927-45d5089a-4a5e-4a45-8ee4-d630cc52fea6.png">

Now you can start programming! In `index.html`, replace `// Youre code goes here` with the following:
```js
moveForward()
turnRight()
moveForward()
```
Now save the file, and refresh your browser. Click the "Start" button and watch the Tribot move.

Try editing the code to help the Tribot reach the treasure!

## Controlling the Tribot
The following functions are available to control the robot:
- `moveForward()`
- `moveBackward()`
- `turnLeft()`
- `turnRight()`
- `changeColor(color)`: you can use a named color, eg `changeColor('blue')` or a hex color eg `changeColor('#800080')`
- `beep()`

## Change the room
There are 3 preset rooms. By default room 1 is selected. You can instead try putting the Tribot in another room by calling `setRoom(roomNumber)` at the top of your script.
For example,
```html
<script type="module" src="https://unpkg.com/tribot"></script>
<script type="module">
setRoom(2)

moveForward()
turnLeft()
beep()
</script>
```

You can also make your own custom room, for example:
```js
setRoom([
  [S,_,_,_],
  [W,_,_,W],
  [T,_,_,W]
])
```
Rooms have:
- `S`: A start position for the Tribot.
- `_`: Empty spaces
- `W`: Walls
- `T`: Treasure

## A Simple AI Tribot
Instead of manually giving the Tribot instructions for how to get to the treasure, you may want to try programming a Tribot that can complete any room without a change of code! To help with this, there are a few global variables available to use:
- `gameInProgress`: Boolean - recommend creating a loop with this variable as shown below
- `obstacleAhead`: Boolean - true if an obstacle (wall or the edge of the room) is in front of the Tribot
- `obstacleBehind`: Boolean - true if an obstacle (wall or the edge of the room) is behind the Tribot

Here is a simple example of an AI Tribot! It may succeed in some rooms but fail in others - how could you improve it?

```html
<script type="module" src="https://unpkg.com/tribot"></script>
<script type="module">
setRoom(2)
while(gameInProgress) {
  while (obstacleAhead) {
    turnLeft()
  }
  moveForward()
}
</script>
```
