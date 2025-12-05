# Devlog Entry - 12/4/25

## How we satisfied the software requirement

### The game uses the same 3D rendering and physics simulation identified by the team for F1 or suitable replacements that still satisfy the F1 requirements.

We are still using three.js and ammo.js as our 3D rendering and physics libraries!

### The game must allow the player to move between scenes (e.g. rooms)

We transition between scenes at the completion of each "level"! Additionally, you can manually access these scenes by pressing "1" or "2".

### The game must allow the player to select specific objects in a scene for interaction (e.g. tapping an item to pick it up or examine it)

The player is able to click/tap each cube to pick them up!

### The game maintains an inventory system allowing the player to carry objects so that what happens in one scene has an impact on what is possible in another scene.

The player is able to store cubes in their inventory by pressing "E"; the stored cube is then spawned back in when the next level is loaded.

### The game contains at least one physics-based puzzle that is relevant to the player's progress in the game.

At the very core of our game is a physics-based color-matching puzzle - the player needs to match colored cubes to the corresponding slot and drop them in!

### The player can succeed or fail at the physics-based puzzle on the basis of their skill and/or reasoning (rather than luck).

Our game succeed/fail condition is based on color-matching prowess; if the player is too slow or otherwise is unable to match the colored blocks to their slot, they'll lose!

### Via play, the game can reach at least one conclusive ending.

## Reflection
