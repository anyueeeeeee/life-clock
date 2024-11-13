let addSnow = true;
let maxSnowTheta = (Math.PI * 4);

let nTrees = 2;
let trees = [];
let backgroundCol;
let branchWidth;
let trunkHeight;
let branchSegment;
let percentBranchless;
let branchRatio;
let growthVertical;
let thetaSplit;
let treeDensity;
let frameCount = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); 
  canvas.style('z-index', '-1'); // Send canvas to the back of other elements
  canvas.style('position', 'fixed'); 
  backgroundCol = color("#e5e4e0");
  background(backgroundCol);
  noFill();
  initializeTreeValues();
  newTrees();
}

window.addEventListener('weeksLivedUpdated', (event) => {
  let weeksLived = event.detail;
  updateBranchWidth(weeksLived);
  newTrees();  // Redraw the trees with the new width
});

function draw() {
  frameCount++;
  //semi-transparent rectangle for the fade effect... probs a better way to do this
  if (frameCount % 5 === 0) {
    fill(backgroundCol.levels[0], backgroundCol.levels[1], backgroundCol.levels[2], 11); // Draw rectangle less often
    noStroke();
    rect(0, 0, windowWidth, windowHeight);
  }

  for (let i = 0; i < trees.length; i++) {
    trees[i].draw();
  }
}

function initializeTreeValues() {
  branchWidth = 22; //tree trunk width
  trunkHeight = 900; //height of trunk
  branchSegment = 30; //number of segments in each branch
  percentBranchless = 0.3; //% of initial growth w/out branches
  branchRatio = 0.5; //ratio of new branch compared to original
  growthVertical = PI / 30; //how straight the tree grows vertically
  thetaSplit = PI / 6; //angle of branches splitting
  treeDensity = 0.33; //probability of new branch forming (density)
  updateBranchWidth(window.weeksLivedGlobal);
}

function updateBranchWidth(weeksLived) {
  if (weeksLived) {
    branchWidth = map(weeksLived, 0, 4000, 7, 33); // Map weeksLived to branch width range
  } else {
    branchWidth = 7; // Default branch width if weeksLived is not defined yet
  }
}

function newTrees() {
  background(backgroundCol);
  for (let i = 0; i < nTrees; i++) {
    trees.push(
      new Tree(
        random(windowWidth), windowHeight, -HALF_PI, branchWidth,
        trunkHeight, branchSegment,
        percentBranchless, branchRatio,
        growthVertical, thetaSplit,
        treeDensity, color(random(111, 222))
      )
    );
  }
}

function mouseClicked() {
  newTrees();
}

class Tree {
  constructor(
    xI, yI, thetaI, branchWidth0I,
    totalBranchLengthI, nBranchDivisionsI,
    percentBranchlessI, branchSizeFractionI,
    dThetaGrowMaxI, dThetaSplitMaxI,
    oddsOfBranchingI, colorI
  ) {
    this.x1 = xI;
    this.y1 = yI;
    this.x2 = xI;
    this.y2 = yI;
    this.theta = thetaI;
    this.branchWidth0 = branchWidth0I;
    this.branchWidth = branchWidth0I;
    this.totalBranchLength = totalBranchLengthI;
    this.nBranchDivisions = nBranchDivisionsI;
    this.percentBranchless = percentBranchlessI;
    this.branchSizeFraction = branchSizeFractionI;
    this.dThetaGrowMax = dThetaGrowMaxI;
    this.dThetaSplitMax = dThetaSplitMaxI;
    this.oddsOfBranching = oddsOfBranchingI;
    this.myColor = colorI;
    this.lengthSoFar = 0;
    this.nextSectionLength = 0;
  }

  draw() {
    //make sure branch is not too thin
    if (this.branchWidth < 0.5) this.lengthSoFar = this.totalBranchLength;

    //grow the branch incrementally, update branch width on length so far (decrease linearly)
    while (this.lengthSoFar < this.totalBranchLength) {
      this.branchWidth = this.branchWidth0 * (1 - this.lengthSoFar / this.totalBranchLength);
    
      //check if new branch should be drawn after % branchless grows
      if (this.lengthSoFar / this.totalBranchLength > this.percentBranchless) {
        if (random(0, 1) < this.oddsOfBranching) {
          //draw new branch with slight random theta angle modification
          let newBranch = new Tree(
            this.x1, this.y1, this.theta + randomSign() * this.dThetaSplitMax, this.branchWidth,
            this.totalBranchLength * this.branchSizeFraction, this.nBranchDivisions,
            this.percentBranchless, this.branchSizeFraction,
            this.dThetaGrowMax, this.dThetaSplitMax,
            this.oddsOfBranching, this.myColor
          );
          newBranch.draw();
        }
      }

      //next branch segment
      this.nextSectionLength = this.totalBranchLength / this.nBranchDivisions;
      this.lengthSoFar += this.nextSectionLength;
      this.theta += randomSign() * random(0, this.dThetaGrowMax);

      //next branch segment end position (this.x2, this.y2)
      this.x2 = this.x1 + this.nextSectionLength * cos(this.theta);
      this.y2 = this.y1 + this.nextSectionLength * sin(this.theta);

      strokeWeight(abs(this.branchWidth));
      stroke(this.myColor);
      line(this.x1, this.y1, this.x2, this.y2);

      this.drawSnow();

      //moves starting position to current end position based on itself (fractal treeeees)
      this.x1 = this.x2;
      this.y1 = this.y2;
    }
  }

  drawSnow() {
    stroke(237,237,237);
    let dx = 0; //offset n/a
    let dy = 0; //offset n/a
    let snowOverlap = 1.2; 
  
    //left-angled branch snow
    if (this.theta < -PI / 2) {
      if (abs(PI + this.theta) < maxSnowTheta) {
        //snow thickness initially 1/2 of branch width, increases as it approaches -PI/2 (horizontal)
        let snowThickness = constrain(abs(this.branchWidth) / 1.5 * (1 - abs(this.theta + PI) / HALF_PI), 0, abs(this.branchWidth) / 2);
        if (snowThickness > 0) {
          strokeWeight(snowThickness);

          //chatGPT helped position snow perpendicular to branches
          dx = (abs(this.branchWidth) - snowThickness) / 2 * cos(this.theta + PI / 2) * snowOverlap;
          dy = (abs(this.branchWidth) - snowThickness) / 2 * sin(this.theta + PI / 2) * snowOverlap;
          line(this.x1 + dx - abs(this.branchWidth) * cos(this.theta) / 4, this.y1 + dy - abs(this.branchWidth) * sin(this.theta) / 4,
            this.x2 + dx, this.y2 + dy);
        }
      }
    }
    
    //right-angled branch snow
    if (this.theta > -PI / 2) {
      if (abs(this.theta) < maxSnowTheta) {
        let snowThickness = constrain(abs(this.branchWidth) / 1.5 * (1 - abs(this.theta) / HALF_PI), 0, abs(this.branchWidth) / 2);
        if (snowThickness > 0) {
          strokeWeight(snowThickness);

          //chatGPT helped position snow perpendicular to branches
          dx = (abs(this.branchWidth) - snowThickness) / 2 * cos(this.theta - PI / 2) * snowOverlap;
          dy = (abs(this.branchWidth) - snowThickness) / 2 * sin(this.theta - PI / 2) * snowOverlap;
          line(this.x1 + dx - abs(this.branchWidth) * cos(this.theta) / 4, this.y1 + dy - abs(this.branchWidth) * sin(this.theta) / 4,
            this.x2 + dx, this.y2 + dy);
        }
      }
    }
  }
}

//randomly deviate branches to left or right in draw-5050 chance
function randomSign() {
  let num = random(-1, 1);
  return num < 0 ? -1 : 1; // true value -1, false value 1
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}