let trees = [];
let physics;
let gb;

let totalLevels;

function setup() {
  createCanvas(windowWidth, windowHeight);
  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  gb = new GravityBehavior(new Vec2D(0, 0.1));
  physics.addBehavior(gb);
  
  //let tree = new Tree(width / 2, height / 2, height / 8, 3, physics, totalLevels);
  // let tree1 = new Tree(width / 2, height / 2 + height / 6, height / 8, 5, physics, totalLevels);
  
  //trees.push(tree);
  //trees.push(tree1);
}

function draw() {
  background(0);
  fill(255, 100);
  physics.update();

  for (let tree of trees) {
    tree.show();
  }

  for (let s of physics.springs) {
    line(s.a.x, s.a.y, s.b.x, s.b.y);
  }

  // if (mouseIsPressed) {
  //   trees[0].lockRoot(mouseX, mouseY);
  // }
}

function keyPressed(){
  if(keyCode === 32){
    location.reload();
  }
}


function mousePressed() {
  totalLevels = floor(random(2,5));
  let branchCount = floor(random(2,4));
  let tree = new Tree(mouseX, mouseY, random(20,100), branchCount, physics, totalLevels);
  tree.lockRoot(mouseX, mouseY);
  trees.push(tree);
}