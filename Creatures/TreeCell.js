class Branch {
  constructor(begin, end, level, totalLevels, physics) {
    this.level = level;
    this.begin = begin;
    this.totalLevels = totalLevels;
    this.end = end;
    this.physics = physics;
    let d = dist(this.end.x, this.end.y, this.begin.x, this.begin.y);

    let repulsion = new AttractionBehavior(this.end, d, -0.7);
    this.physics.addBehavior(repulsion);

    let spring = new VerletSpring2D(this.begin, this.end, d, 0.05);
    this.physics.addSpring(spring);
    this.finished = false;

  }

  show() {
    stroke(255, 150);
    // let sw = 4 / log(this.level + 2);
    // strokeWeight(sw);
    let sw = map(this.level, this.totalLevels, 0, 5, 1);
    let sw1 = map(this.level, this.totalLevels, 0, 1, 3);
    let a = map(this.level, this.totalLevels, 0, 200, 50)
    strokeWeight(sw1);
    //strokeWeight(1);
    //console.log(`level: ${this.level}, strokeWeight: ${sw}`);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    fill(255,a);
    circle(this.end.x, this.end.y, sw * 5 + 5 * sin(frameCount/40));
  }

  branchA() {
    let dir = this.end.sub(this.begin);
    dir.rotate(PI / random(1, 6));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    this.physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels, this.physics);
    return b;
  }

  branchB() {
    let dir = this.end.sub(this.begin);
    dir.rotate(-PI / random(1, 4));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    this.physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels, this.physics);
    return b;
  }
}

class Tree {
  constructor(startX, startY, branchLength, branchCount, physics, levels, bLock) {
    this.tree = [];
    this.physics = physics;
    this.branchLength = branchLength;
    this.levels = levels;
    this.branchCount = branchCount;
    this.bLock = bLock;
    //branchCount就是一组里面有几根分形树

    let a = new VerletParticle2D(startX, startY);
    a.lock();
    this.physics.addParticle(a);

    this.generateTree(a, this.branchLength, this.branchCount, this.levels);
  }

  generateTree(rootParticle, branchLength, branchCount, levels) {
    let angleStep = TWO_PI / this.branchCount;

    for (let i = 0; i < this.branchCount; i++) {
      let angle = angleStep * i;
      let b = new VerletParticle2D(rootParticle.x + cos(angle) * branchLength, rootParticle.y + sin(angle) * branchLength);
      this.physics.addParticle(b);

      //锁住第二层级粒子
      if(this.bLock){
        b.lock();
      }
      
      //看好处于哪个物理系统！
      let rootBranch = new Branch(rootParticle, b, 0, this.levels, this.physics);
      this.tree.push(rootBranch);
    }

    for (let n = 0; n < levels; n++) {
      for (let i = this.tree.length - 1; i >= 0; i--) {
        if (!this.tree[i].finished) {
          let a = this.tree[i].branchA();
          let b = this.tree[i].branchB();
          this.tree.push(a);
          this.tree.push(b);
        }
        this.tree[i].finished = true;
      }
    }
  }

  show() {
    for (let i = this.tree.length - 1; i >= 0; i--) {
      this.tree[i].show();
    }
  }

}

let trees = [];
function createTree() {

  const treeCount = 5; // 假设您想要5棵树
    const spacing = width / treeCount; // 计算画布宽度与树数量之间的间距

    for (let i = 0; i < treeCount; i++) {
        let x = spacing * i + spacing / 2; // 计算每棵树的x坐标
        let y = height  

        // let totalLevels = floor(random(3, 5));
        // let branchCount = floor(random(2, 4));
        let totalLevels = 3;
        let branchCount = 2;
        //看好在哪个physics里面
        let tree = new Tree(x, y, random(50,80), branchCount, physics, totalLevels, true);
        let _tree = new Tree(x, -y, random(50,80), branchCount, physics, totalLevels, true);
        //let tree = new Tree(x, y, random(50, 100), branchCount, tailPhysics, totalLevels);
        trees.push(tree);
        trees.push(_tree);
    }
}

function drawTree() {

  for (let tree of trees) {
    tree.show();
  }
}

let treeCells = [];
function createTreeCell(row, col) {
  let gridWidth = width / row;
  let gridHeight = height / col;//几行几列就改成几

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let x = gridWidth * i + gridWidth / 2;
      let y = gridHeight * j + gridHeight / 2;

      let totalLevels = floor(random(2, 5));
      let branchCount = floor(random(3, 5));
      let tree = new Tree(x, y, random(40, 80), branchCount, physics, totalLevels, false);
      //tree.lockRoot(x, y);
      treeCells.push(tree);
    }
  }
  //let tree = new Tree(width / 2, height / 2, height / 8, 3, physics, totalLevels);
  // let tree1 = new Tree(width / 2, height / 2 + height / 6, height / 8, 5, physics, totalLevels);

  //treeCells.push(tree);
  //treeCells.push(tree1);
}

function drawTreeCell() {
  for (let treeCell of treeCells) {
    treeCell.show();
  }

  // for (let s of physics.springs) {
  //   line(s.a.x, s.a.y, s.b.x, s.b.y);
  // }
}