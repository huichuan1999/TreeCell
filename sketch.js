let trees = [];
let physics;
let gb;
let canvas;
//let totalLevels;

let handParticles = [];
let handAttractions = [];

// Adjust the pinch threshold according to the actual situation
const pinchThreshold = 30;
let particleGrabRadius = 20;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight); 
  canvas.id("canvas");
  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  // gb = new GravityBehavior(new Vec2D(0, 0.1));
  // physics.addBehavior(gb);

  physics.setDrag(0.05);

  colorMode(HSB,255);
   
    let gridWidth = width / 2;
    let gridHeight = height / 2;//几行几列就改成几

  for(let i = 0; i < 2; i++) {
    for(let j = 0; j < 2; j++) {
      let x = gridWidth * i + gridWidth / 2;
      let y = gridHeight * j + gridHeight / 2;

      let totalLevels = floor(random(2,5));
      let branchCount = floor(random(2,4));
      let tree = new Tree(x, y, random(20,100), branchCount, physics, totalLevels);
      //tree.lockRoot(x, y);
      trees.push(tree);
    }
  }
  //let tree = new Tree(width / 2, height / 2, height / 8, 3, physics, totalLevels);
  // let tree1 = new Tree(width / 2, height / 2 + height / 6, height / 8, 5, physics, totalLevels);
  
  //trees.push(tree);
  //trees.push(tree1);
}

function draw() {
  // background(0);
  clear();
  fill(255, 100);
  physics.update();

  for (let tree of trees) {
    tree.show();
  }

  for (let s of physics.springs) {
    line(s.a.x, s.a.y, s.b.x, s.b.y);
  }

    //draw hand landmarks
    if (detections != undefined) {
      if (detections.multiHandLandmarks != undefined) {
  
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
    }

      //If detected hand
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // // Skip keys with index 8 (index finger) or 4 (thumb)
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }
  }

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  for (let i = 0; i < handParticles.length; i++) {
    //there is maybe a better place and time to do this but it was looking like there were
    //19 handparticles so we only really want 19 physcis behaviors,
    // 输出behavior的数量
    //console.log(physics.behaviors.length);
    //console.log(physics.particles.length);

    if(physics.behaviors.length < physics.particles.length + 19){//记得加上Branch的排斥力behavior
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      //handAttractions[i].strength = 1;//increase the strength because it was -0.5 so it's too small for each attractor to have an impact.
      physics.addBehavior(handAttractions[i]);
    }else{
      //comment out the line below, and you will see that while it's running, as long as the hand
      //is tracking the first time, the physcis behaviors work until the tracking of the hand is lost
//This is because in the if statement before it is enough to only say once, hey I want to set this hand particle as the attractor for my behaviour
      // so you could maybe make this even more efficient if you only do this bit every time the hand is first tracked
      // AFTER you lose tracking of the hand. you will need to investigate your hand tracking library
      handAttractions[i].attractor.set(handParticles[i].getPosition());

    }
  }

}

function keyPressed(){
  if(keyCode === 32){
    location.reload();
  }
}


function mousePressed() {
  // let totalLevels = floor(random(2,5));
  // let branchCount = floor(random(2,4));
  // let tree = new Tree(width-mouseX, mouseY, random(20,100), branchCount, physics, totalLevels);
  // tree.lockRoot(width-mouseX, mouseY);
  // trees.push(tree);
}