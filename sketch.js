
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverimg
var restartimg
var die 
var checkpoint
var jump

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0
var cloudsGroup

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");

  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  checkpoint = loadSound("checkpoint.mp3")

  gameOverimg = loadImage("gameOver.png")

  restartimg = loadImage("restart.png")

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  
}

function setup() {

  createCanvas(windowWidth, windowHeight)
  
  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //crie um sprite ground (solo)
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

  gameOver = createSprite(300, 60, 400, 20);
  gameOver.addImage(gameOverimg)

  restart = createSprite(300, 100)
  restart.addImage(restartimg)

  gameOver.scale = 0.5

  restart.scale = 0.5
  
  //crie um solo invisível
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //gerar números aleatórios
  var rand =  Math.round(random(1,100))
  console.log(rand)

  obstaclesGroup = createGroup();

  cloudsGroup = createGroup();

  trex.setCollider("circle",0, 0, 40);

  trex.debug = false;
}

function draw() {
  //definir cor de fundo
  background(180);
  
  text("Pontuação: "+ score, 500,50);

  
  if(gameState === PLAY){
    //mover o solo
    
    if(touches.length > 0 || keyDown("SPACE") && trex.y >= height-120){
      jump.play
      trex.y = -10
      touches = []
    }
    ground.velocityX = -(4 + score/100);

    gameOver.visible = false

    restart.visible = false

    score = score + Math.round(frameCount/60);

    if(score > 0 && score%100 === 0){
      checkpoint.play();
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
     
    if(keyDown("space")&& trex.y >= 161) {
      trex.velocityY = -(10 + score/1000);
      jump.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8
    

    spawnClouds();
  
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      trex.velocityY = -7
      gameState = END;
      die.play();
    }
  }
  else if(gameState === END){
    //pare o solo
    ground.velocityX = 0;

    gameOver.visible = true

    restart.visible = true

    trex.changeAnimation("collided", trex_collided)

    obstaclesGroup.setLifetimeEach(-1);

    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);

    cloudsGroup.setVelocityXEach(0);
    if(mousePressedOver(restart)){
      reset()
    }
    
    
  }

  console.log(trex.y);
  
  


  
  //impedir que o trex caia
  trex.collide(invisibleGround);
  


  drawSprites();

}

//função para gerar as nuvens
function spawnClouds(){
  if( frameCount % 30  === 0){
   cloud=createSprite(600, 100, 40, 10);
  
   cloud.addImage(cloudImage);
   cloud.y= Math.round(random(10, 60));
   cloud.scale = 0.4;
   cloud.velocityX=-3 - frameCount/60;
   cloud.lifetime = 300;
   cloud.depth = trex.depth;
   trex.depth = trex.depth + 1;
   cloudsGroup.add(cloud) };
}
function spawnObstacles(){
  if (frameCount % Math.round(60) === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(7 + score/100);
    obstacle.scale= 1
     // //gerar obstáculos aleatórios
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;
       case 2: obstacle.addImage(obstacle2);
               break;
       case 3: obstacle.addImage(obstacle3);
               break;
       case 4: obstacle.addImage(obstacle4);
               break;
       case 5: obstacle.addImage(obstacle5);
               break;
       case 6: obstacle.addImage(obstacle6);
               break;
       default: break;
     }
  
     obstacle.scale = 0.5;
     obstacle.lifetime = 300;
     obstaclesGroup.add(obstacle);
  }}
  function reset(){
    gameState = PLAY 
    gameOver.visible = false
    restart.visible = false
    frameCount = 0
    obstaclesGroup.destroyEach()
    cloudsGroup.destroyEach()
    trex.changeAnimation("running", trex_running)
    score = 0
    trex.y=100
  }
  