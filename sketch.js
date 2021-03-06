const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zombie ; 
var zombie1, zombie2, zombie3, zombie4;
var breakButton;
var backgroundImage;
var sadImg;
var stones = [];
var collided = false;
function preload() {
  zombie1 = loadImage("./assets/zombie1.png");
  zombie2 = loadImage("./assets/zombie2.png");

  zombie3 = loadImage("./assets/zombie3.png");
  zombie4 = loadImage("./assets/zombie4.png");

  sadImg = loadImage("./assets/sad_zombie.png")

  backgroundImage = loadImage("./assets/background.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20, "#795548", true);
  //leftWall = new Base(300, height / 2 + 5, 500, 75, "#8d6e63", true);
  //rightWall = new Base(width - 250, height / 2 + 5, 600, 75, "#8d6e63", true);

  bridge = new Bridge(27, { x: 75, y: height /2 -140 });
  jointPoint = new Base(width - 250, height / 2 -100, 40, 20, "#8d6e63", true);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-10, 140);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }
  zombie = createSprite(width / 2, height - 110);
  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft", zombie3, zombie4, zombie3);
  zombie.scale = 0.1;
  zombie.velocityX = 1;

  breakButton = createImg('./assets/axe.png');
  breakButton.position(width - 150, height / 2 - 100);
  breakButton.class("breakButton");
  breakButton.size(50,50); 
  breakButton.mouseClicked(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  ground.show();
  bridge.show();
  //leftWall.show();
 // rightWall.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x,zombie.position.y,pos.x,pos.y);
    if(distance <=50){
        zombie.velocityX = 0;
        Matter.Body.setVelocity(stone.body, {x:10,y:-10} );
        zombie.changeImage('sadImg');
        collided = true ;
      }
  }

if(zombie.position.x>= width - 300){
zombie.velocityX = -10;
zombie.changeAnimation("righttoleft");
}
if (zombie.position.x <= 300) {
  zombie.velocityX = 10;
  zombie.changeAnimation("lefttoright");
}

   drawSprites();

}

function handleButtonPress(){
  jointLink.detach();
  setTimeout(() => {
    bridge.break();
  }, 1500);

}