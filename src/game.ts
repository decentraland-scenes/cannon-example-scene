/*
  IMPORTANT: Need to copy everything from cannon.js to /bin/game.js - just copy and paste at the top of the the game.js files.
  
  #1 Run 'dcl start'
  #2 Copy everything from ../node_modules/cannon/build/cannon.js to the file /bin/game.js - just paste at the top of the file
  #3 Refresh browser
  
*/

import utils from '../node_modules/decentraland-ecs-utils/index'

// Create base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape('models/baseScene.glb'))
baseScene.addComponent(
  new Transform({
    scale: new Vector3(2, 1, 2),
  })
)
engine.addEntity(baseScene)

/// >>>> NEEDS REFECTORING <<<<

// Create red ball
const redBall = new Entity()
redBall.addComponent(new GLTFShape('models/redBall.glb'))

const redBallPosX = 15.5
const redBallPosY = 18
const redBallPosZ = 15.5
redBall.addComponent(
  new Transform({
    position: new Vector3(redBallPosX, redBallPosY, redBallPosZ),
  })
)

redBall.getComponent(Transform).scale.setAll(1)
engine.addEntity(redBall)

// Create green ball
const greenBall = new Entity()
greenBall.addComponent(new GLTFShape('models/greenBall.glb'))

const greenBallPosX = 16
const greenBallPosY = 13
const greenBallPosZ = 16
greenBall.addComponent(
  new Transform({
    position: new Vector3(greenBallPosX, greenBallPosY, greenBallPosZ),
  })
)
greenBall.getComponent(Transform).scale.setAll(1)
engine.addEntity(greenBall)

// Create blue ball
const blueBall = new Entity()
blueBall.addComponent(new GLTFShape('models/blueBall.glb'))

const blueBallPosX = 16.5
const blueBallPosY = 20
const blueBallPosZ = 16.5
blueBall.addComponent(
  new Transform({
    position: new Vector3(blueBallPosX, blueBallPosY, blueBallPosZ),
  })
)
blueBall.getComponent(Transform).scale.setAll(1)
engine.addEntity(blueBall)

// Create pink ball
const pinkBall = new Entity()
pinkBall.addComponent(new GLTFShape('models/pinkBall.glb'))

const pinkBallPosX = 15.5
const pinkBallPosY = 22.5
const pinkBallPosZ = 16.5
pinkBall.addComponent(
  new Transform({
    position: new Vector3(pinkBallPosX, pinkBallPosY, pinkBallPosZ),
  })
)
pinkBall.getComponent(Transform).scale.setAll(1)
engine.addEntity(pinkBall)

// Create yellow ball
const yellowBall = new Entity()
yellowBall.addComponent(new GLTFShape('models/yellowBall.glb'))

const yellowBallPosX = 15.5
const yellowBallPosY = 16
const yellowBallPosZ = 15.5
yellowBall.addComponent(
  new Transform({
    position: new Vector3(yellowBallPosX, yellowBallPosY, yellowBallPosZ),
  })
)
yellowBall.getComponent(Transform).scale.setAll(1)
engine.addEntity(yellowBall)

// Setup our world
var world = new CANNON.World()
world.gravity.set(0, 0, -9.82) // m/s²

// Create bodies to represent the balls
var radius = 1 // m
var redBallBody = new CANNON.Body({
  mass: 5, // kg
  position: new CANNON.Vec3(redBallPosX, redBallPosZ, redBallPosY), // m
  shape: new CANNON.Sphere(radius),
})
world.addBody(redBallBody)

var greenBallBody = new CANNON.Body({
  mass: 5, // kg
  position: new CANNON.Vec3(greenBallPosX, greenBallPosZ, greenBallPosY), // m
  shape: new CANNON.Sphere(radius),
})
world.addBody(greenBallBody)

var blueBallBody = new CANNON.Body({
  mass: 5, // kg
  position: new CANNON.Vec3(blueBallPosX, blueBallPosZ, blueBallPosY), // m
  shape: new CANNON.Sphere(radius),
})
world.addBody(blueBallBody)

var pinkBallBody = new CANNON.Body({
  mass: 5, // kg
  position: new CANNON.Vec3(pinkBallPosX, pinkBallPosZ, pinkBallPosY), // m
  shape: new CANNON.Sphere(radius),
})
world.addBody(pinkBallBody)

var yellowBallBody = new CANNON.Body({
  mass: 5, // kg
  position: new CANNON.Vec3(yellowBallPosX, yellowBallPosZ, yellowBallPosY), // m
  shape: new CANNON.Sphere(radius),
})
world.addBody(yellowBallBody)

// Create a plane
var groundBody = new CANNON.Body({
  mass: 0, // mass == 0 makes the body static
})
var groundShape = new CANNON.Plane()
groundBody.addShape(groundShape)
world.addBody(groundBody)

// Create materials and add them to the bodies
var physicsMaterial = new CANNON.Material('groundMaterial')
var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
  friction: 0.5,
  restitution: 0.33,
})
world.addContactMaterial(physicsContactMaterial)
groundBody.material = physicsMaterial

var bouncyMaterial = new CANNON.Material('sphereMaterial')
var sphereContactMaterial = new CANNON.ContactMaterial(physicsMaterial, bouncyMaterial, {
  friction: 0.4,
  restitution: 0.75,
})
world.addContactMaterial(sphereContactMaterial)

// Add materials to bodies
redBallBody.material = bouncyMaterial
greenBallBody.material = bouncyMaterial
blueBallBody.material = bouncyMaterial
pinkBallBody.material = bouncyMaterial
yellowBallBody.material = bouncyMaterial

// Bodies will keep rolling even with friction so you need linearDamping
redBallBody.linearDamping = 0.4
greenBallBody.linearDamping = 0.4
blueBallBody.linearDamping = 0.4
pinkBallBody.linearDamping = 0.4
yellowBallBody.linearDamping = 0.4

var fixedTimeStep = 1.0 / 60.0 // seconds
var maxSubSteps = 3

class updateSystem implements ISystem {
  update(dt: number): void {
    // Instruct the world to perform a single step of simulation.
    // It is generally best to keep the time step and iterations fixed.
    world.step(fixedTimeStep, dt, maxSubSteps)

    // NOTE: the y and z axis are switched
    redBall.getComponent(Transform).position.set(redBallBody.position.x, redBallBody.position.z, redBallBody.position.y) 
    greenBall
      .getComponent(Transform)
      .position.set(greenBallBody.position.x, greenBallBody.position.z, greenBallBody.position.y) 
    blueBall
      .getComponent(Transform)
      .position.set(blueBallBody.position.x, blueBallBody.position.z, blueBallBody.position.y) 
    pinkBall
      .getComponent(Transform)
      .position.set(pinkBallBody.position.x, pinkBallBody.position.z, pinkBallBody.position.y) 
    yellowBall
      .getComponent(Transform)
      .position.set(yellowBallBody.position.x, yellowBallBody.position.z, yellowBallBody.position.y)

    redBall.getComponent(Transform).rotation = new Quaternion(
      redBallBody.quaternion.y,
      redBallBody.quaternion.z,
      redBallBody.quaternion.x,
      redBallBody.quaternion.w
    )
    greenBall.getComponent(Transform).rotation = new Quaternion(
      greenBallBody.quaternion.y,
      greenBallBody.quaternion.z,
      greenBallBody.quaternion.x,
      greenBallBody.quaternion.w
    )
    blueBall.getComponent(Transform).rotation = new Quaternion(
      blueBallBody.quaternion.y,
      blueBallBody.quaternion.z,
      blueBallBody.quaternion.x,
      blueBallBody.quaternion.w
    )
    pinkBall.getComponent(Transform).rotation = new Quaternion(
      pinkBallBody.quaternion.y,
      pinkBallBody.quaternion.z,
      pinkBallBody.quaternion.x,
      pinkBallBody.quaternion.w
    )
    yellowBall.getComponent(Transform).rotation = new Quaternion(
      yellowBallBody.quaternion.y,
      yellowBallBody.quaternion.z,
      yellowBallBody.quaternion.x,
      yellowBallBody.quaternion.w
    )
    // log('Sphere z position: ' + sphereBody.position.z)
  }
}

// Delay the simulation by 3 secs
const delayEntity = new Entity()
delayEntity.addComponent(
  new utils.Delay(3000, (): void => {
    engine.addSystem(new updateSystem())
  })
)
engine.addEntity(delayEntity)
