/*
  IMPORTANT: The tsconfig.json has been configured to include "node_modules/cannon/build/cannon.js"
*/

import utils from "../node_modules/decentraland-ecs-utils/index"
import { Ball } from "./ball"

// Create base scene
const baseScene: Entity = new Entity()
baseScene.addComponent(new GLTFShape("models/baseScene.glb"))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// Ball shapes
const ballShapes: GLTFShape[] = [
  new GLTFShape("models/redBall.glb"),
  new GLTFShape("models/greenBall.glb"),
  new GLTFShape("models/blueBall.glb"),
  new GLTFShape("models/pinkBall.glb"),
  new GLTFShape("models/yellowBall.glb"),
]

const balls: Ball[] = [] // Store balls
let ballHeight = 12 // Start height for the balls

// Create random balls and positions
for (let i = 0; i < ballShapes.length; i++) {
  let randomPositionX: number = Math.floor(Math.random() * 3) + 14
  let randomPositionY: number = ballHeight
  let randomPositionZ: number = Math.floor(Math.random() * 3) + 14

  const ball = new Ball(
    ballShapes[i],
    new Transform({
      position: new Vector3(randomPositionX, randomPositionY, randomPositionZ),
    })
  )
  balls.push(ball)
  ballHeight += 2 // To ensure the colliders aren't intersecting when the simulation starts
}

// Setup our world
const world: CANNON.World = new CANNON.World()
world.gravity.set(0, 0, -9.82) // m/s²

var groundPhysicsMaterial = new CANNON.Material("groundMaterial")
var groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
  friction: 0.5,
  restitution: 0.33,
})
world.addContactMaterial(groundPhysicsContactMaterial)

// Create a ground plane and apply physics material
const groundBody: CANNON.Body = new CANNON.Body({
  mass: 0, // mass == 0 makes the body static
})
const groundShape: CANNON.Plane = new CANNON.Plane()
groundBody.addShape(groundShape)
groundBody.material = groundPhysicsMaterial
world.addBody(groundBody)

const ballPhysicsMaterial: CANNON.Material = new CANNON.Material("ballMaterial")
var ballPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, ballPhysicsMaterial, {
  friction: 0.4,
  restitution: 0.75,
})
world.addContactMaterial(ballPhysicsContactMaterial)

const ballBodies: CANNON.Body[] = [] // Store ball bodies

// Create bodies to represent each of the balls
for (let i = 0; i < balls.length; i++) {
  let ballTransform = balls[i].getComponent(Transform)

  const ballBody: CANNON.Body = new CANNON.Body({
    mass: 5, // kg
    position: new CANNON.Vec3(ballTransform.position.x, ballTransform.position.z, ballTransform.position.y), // m (NOTE: y-axis switched with z-axis)
    shape: new CANNON.Sphere(1), // m (Create sphere shaped body with a radius of 1)
  })

  ballBody.material = ballPhysicsMaterial // Add bouncy material to ball body
  ballBody.linearDamping = 0.4 // Round will keep translating even with friction so you need linearDamping
  ballBody.angularDamping = 0.4 // Round bodies will keep rotating even with friction so you need angularDamping

  world.addBody(ballBody) // Add body to the world
  ballBodies.push(ballBody)
}

const fixedTimeStep: number = 1.0 / 60.0 // seconds
const maxSubSteps: number = 3

class updateSystem implements ISystem {
  update(dt: number): void {
    // Instruct the world to perform a single step of simulation.
    // It is generally best to keep the time step and iterations fixed.
    world.step(fixedTimeStep, dt, maxSubSteps)

    // NOTE: the y and z axis are switched
    for (let i = 0; i < balls.length; i++) {
      balls[i].getComponent(Transform).position.set(ballBodies[i].position.x, ballBodies[i].position.z, ballBodies[i].position.y)
      balls[i].getComponent(Transform).rotation = new Quaternion(
        ballBodies[i].quaternion.y,
        ballBodies[i].quaternion.z,
        ballBodies[i].quaternion.x,
        ballBodies[i].quaternion.w
      )
    }
  }
}

// Delay the simulation by 1.5 secs so that you can appreciate the beauty
const delayEntity = new Entity()
delayEntity.addComponent(
  new utils.Delay(1500, (): void => {
    engine.addSystem(new updateSystem())
  })
)
engine.addEntity(delayEntity)
