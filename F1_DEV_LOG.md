# Devlog Entry - 12/1/25

## How we satisfied the software requirements

### It is built using a platform (i.e. engine, framework, language) that does not already provide support for 3D rendering and physics simulation

We are using the baseline web platform, as we have stated in our previous DevLog entry.

### It uses a third-party 3D rendering library

The project uses the Three.js library to render our scene. There have been no troubles with Three so far, and it has worked well with our physics library.

### It uses a third-party physics simulation library

We have been using Ammo.js for our third-party physics library, as it is commonly used with Three.js and is based on a well-documented physics library Bullet.

### The playable prototype presents the player with a simple physics-based puzzle

Our puzzle was changed from the previous design mentioned in our original DevLog entry. There is no slingshot physics, but there may be in the future. Instead, our puzzle is a simple drag-and-drop puzzle where the player must fit the right objects into the right holes to win.

### The player is able to exert some control over the simulation in a way that allows them to succeed or fail at the puzzle

The player can pick up objects, with the correct objects being dropped into the right holes being the solution to the puzzle.

### The game detects success or failure and reports this back to the player using the game's graphics

We have a win screen that displays when the player completes the goal we have set (getting all the objects into the right holes).

### The codebase for the prototype must include some before-commit automation that helps developers

Our Tools and Engine Lead, Tien, created the linter which blocks the code from being pushed if it is not formatted correctly.

### The codebase for the prototype must include some post-push automation that helps developers

Tien also set up the automatic deployment to Github Pages so that we could ensure the build ran properly after being pushed to the repository.

## Reflection

Looking back on how you achieved the F1 requirements, how has your team’s plan changed since team formation? Did you reconsider any of the choices you previously described for Tools and Materials or your Roles? It would be very suspicious if you didn’t need to change anything. There’s learning value in you documenting how your team’s thinking has changed over time.

We did not change the way our team functioned in terms of Tools and Materials or Roles. We did need to adjust our approach to how we programmed this portion of the assignment, especially since there were a lot of bugs. We did briefly consider changing away from Ammo because of our mishandling of the library, but once the professor pointed out that it was not the right library we were using and that our attempts at creating a deno environment were faulty, we decided to continue with Ammo. So far, it has not failed us so we will move forward with using it. We also decided to move away from our previous idea of the physics puzzle because of time constraints and difficulty navigating the new libraries in favor of a simpler game. Overall, the first portion of this project was quite challenging, but we are optimistic that the future portions will go smoother now that we have a foothold.
