let physics;
let tailPhysics;
let gb;
let canvas;
//let totalLevels;

let handParticles = [];
let handAttractions = [];

// Adjust the pinch threshold according to the actual situation
const pinchThreshold = 30;
let particleGrabRadius = 20;

function setup() {
  canvas = createCanvas(1920/2,1080/2);
  canvas.id("canvas");
  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  // gb = new GravityBehavior(new Vec2D(0, 0.1));
  // physics.addBehavior(gb);

  physics.setDrag(0.05);

  tailPhysics = new VerletPhysics2D();
  tailPhysics.setWorldBounds(new Rect(0, 0, width, height));
  let gb = new GravityBehavior(new Vec2D(0, 0.1));// add gravity to tails
  tailPhysics.addBehavior(gb);
  tailPhysics.setDrag(0.02);


  colorMode(HSB, 255);
  createTreeCell(3, 1);
  createTree();
  //createParticleNetrwork();

}

function draw() {
  // background(0);
  clear();
  fill(255, 100);
  physics.update();
  tailPhysics.update();

  drawHand();
  handDetected()
  drawTreeCell();
  drawTree();
  //drawParticleNetwork();
}



function keyPressed() {
  if (keyCode === 32) {
    location.reload();
  }
}

function mousePressed() {
  // let totalLevels = floor(random(2,5));
  // let branchCount = floor(random(2,4));
  // let tree = new Tree(width-mouseX, mouseY, random(20,100), branchCount, physics, totalLevels);
  // tree.lockRoot(width-mouseX, mouseY);
  // treeCells.push(tree);
}

function handDetected() {

  //If detected hand
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  //添加手部粒子对物理系统中粒子的影响
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // // Skip keys with index 8 (index finger) or 4 (thumb)
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }

    //适用于tailphysics 的交互
    // if (tailPhysics.behaviors.length < tailPhysics.particles.length + 19) {
    //   handAttractions[i].attractor.set(handParticles[i].getPosition());
    //   tailPhysics.addBehavior(handAttractions[i]);
    // } else {
    //   handAttractions[i].attractor.set(handParticles[i].getPosition());
    // }
    //适用于physics 的交互
    if (physics.behaviors.length < physics.particles.length + 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      physics.addBehavior(handAttractions[i]);
    } else {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }

  }

  //console.log(tailPhysics.particles.length,tailPhysics.behaviors, tailPhysics);

}


function drawHand() {
  //draw hand landmarks
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {

      //console.log(detections);

      //draw landmarks 
      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm base
      drawLandmarks([1, 5], 60);//thumb
      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky

    }
  }else{
    //remove Behaviors
    removeHandParticles();
  }
}

function removeHandParticles() {
  for (let i = 0; i < handParticles.length; i++) {
    // 删除handAttractions的物理行为
    if (handAttractions[i]) {
      //console.log("Removing hand particles...");
      tailPhysics.removeBehavior(handAttractions[i]);
    }
    // 这里还可以添加其他必要的清理代码，例如从physics中删除粒子等
  }
  // 清空手部粒子和吸引力数组
  handParticles = [];
  handAttractions = [];
}