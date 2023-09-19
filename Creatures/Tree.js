class Tree {
    constructor(startX, startY, branchLength, branchCount, physics, levels) {
        this.tree = [];
        this.physics = physics;
        this.branchLength = branchLength;
        this.levels = levels;
        this.branchCount = branchCount;
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
            let rootBranch = new Branch(rootParticle, b, 0, this.levels);
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

    lockRoot(x, y) {
        this.tree[0].begin.x = x;
        this.tree[0].begin.y = y;
    }
}
