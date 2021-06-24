//Declaration of Global Variables
var man,man_run,man_stop;
var colour1 ,colour1_img;
var obstacle,obstacle_img;
var colour2, colour2_img;
//Group variables
var colour1Group,obsGroup,colour2Group;
//Score & losing system
var survivalTime,score,chances;
var ground,ground_img;
var gameOver,gameOver_img;
var restart,restart_img;
//Game States
var START=1;
var PLAY=2;
var END=0;
var gameState=START;
//sound variables
var longjump_sound;
var jumpSound;
var dieSound;
var checkPointSound;
var gameOverSound;

function preload()
{
  //To load monkey animation
man_run =   loadAnimation("MAN1.png","MAN2.png","MAN3.png","MAN4.png","MAN5.png","MAN6.png","MAN7.png","MAN8.png");
  
  colour1_img = loadImage("colour1.png");
  obstacle_img = loadImage("obstacle.png");
  ground_img=loadImage("ground2.png");
  colour2_img=loadImage("colour2.png");
  gameOver_img=loadImage("gameover.png");
  restart_img=loadImage("restart.png");

  //To load sounds  
  longjump_sound=loadSound("longjump.mp3");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  gameOverSound=loadSound("gameOver.mp3");
}
//600,400


function setup() {
  //To create a canvas
  createCanvas(displayWidth,displayHeight);
  
  //To create monkey sprite
  man=createSprite(60,height-75,10,10);  
  man.addAnimation("run",man_run);
  //Scaling to adjust the animation
  man.scale=0.3;
  //monkey.debug=true;
  //To make monkey look like it is on the ground not outside it
  man.setCollider("rectangle",0,0,550,340);
  
  //To create ground sprite
  ground=createSprite(width/2,height-42,1200,8);
  ground.addImage(ground_img);
  
  //To declare new Groups
  colour1Group=new Group();
  obsGroup=new Group();
  colour2Group=new Group();
  
  //Initial value of survival Time
  survivalTime=10;
  //Initial value of score
  score=0;
  //Initial value of chances
  chances=3;
  
  //To create gameOver sprite
  gameOver=createSprite(width/2,height-250,10,10)
  gameOver.addImage(gameOver_img);
  gameOver.scale=1.5;
  
  //To create restart 
  restart=createSprite(width-295,height-150,10,10);
  restart.addImage(restart_img);
  restart.scale=0.3;
}


function draw()
{
  //To assign the background
  background("white");
  
  if(gameState===START)
  {
   //To make restart & game Over invisible
   gameOver.visible=false;
   restart.visible=false;
    
   //Instructions for playing this game/USER GUIDE
   background("azure");
   fill("darkcyan");
   textSize(30);
   text("FIGHT FOR COLOURS",170,80);
   fill("red");
   textSize(18);
   text("1.Press Space Key to Start the Game",50,110);
   fill("black");
   text("2.Press UP Arrow Key for long jump",50,135);
   text("3.Press Space Key to Jump",50,160);
    fill("blue");
   text("The story revolves around a boy who loves the festival of colours.",50,350);
    text("This HOLI, he forgot to buy colours due to exams.", 50, 375);
    text("Help him by jumping and collecting colours.",50, 400);
    textSize(30);
    text("मुश्किल वक्त, कमांडो सख्त", 170, 457);
    fill("black");
    textSize(18);
   text("4.Don't Let Survival Time to be 0 otherwise game will end",50,185);
   text("5.Collect colours to score and get survival time",50,210);
   text("6.Avoid the obstacles otherwise you will lose 1 chance from 3",50,235);
   text("7.Try to Score high, With more score game will get more difficult",50,260);
   text("8.Avoid Long Jump unnecessary as it decrease survival time",50,285);
   text("!!ALL THE BEST!!",250,475);
    fill("green");
    textSize(35);
    text("STORY:->", 230, 320);
   
   //To make monkey & ground invisible during start state
   man.visible=false;
   ground.visible=false;

   //Condition for entering in PLAY state
   if(keyDown("space"))
   {
     gameState=PLAY;
   }
   
  }
  else if(gameState===PLAY)
  {
    //To make monkey & ground visible during PLAY state
    man.visible=false;
    ground.visible=false;
    ground.visible=true;
    man.visible=true;
    
    //To increase the ground speed with increasement in score
    ground.velocityX=-(4+score/10);
    
    //Adding background changing effect
    if(score%10===0)
    {
      background("yellow");
    }else if(score%5===0)
    {
      background("lightgreen");
    }else if(score%8===0)
    {
      background("pink");
    }
    
    //To make the monkey jump to surmount obstacles
    if(keyDown("space")&&man.y>320)
    { 
      //To assign upward velocity to monkey
      man.velocityY=-11;
      jumpSound.play();
    }
    
    //To make monkey long jump to collect oranges
    else if(keyDown("UP_ARROW")&&man.y>320)
    {
      //To make monkey move up
      man.velocityY=-16.5;
      //Monkey get hungry and survival time decrease with long jump
      survivalTime=survivalTime-1;
      //To play long jump sound
      longjump_sound.play();
    } 
    
    //To add gravity 
    man.velocityY=man.velocityY+0.5;
    
    //To increase the score when monkey touches banana
    if(man.isTouching(colour1Group))
    {
      colour1Group.destroyEach();
      score=score+2;
      survivalTime=survivalTime+5;
    }
    
    //To add bonus to score when monkey touches oranges
    if(man.isTouching(colour2Group))
    {
      colour2Group.destroyEach();
      score=score+5;
      survivalTime=survivalTime+10;
    } 
    
    
    //To decrease survival time with frame rate
    if(frameCount%100===0)
    {
      survivalTime=survivalTime-1;
    }
    
    //To detect and decrease the chanes when monkey touches any       obstacles
    if(man.isTouching(obsGroup))
    {
      chances=chances-1;
      obsGroup.destroyEach();
      dieSound.play();
    }
    
    //To play a beep sound in multiple of 20 i.e.20,40,60,80
    if(score>0&&score%20===0)
    {
      //Adding beep sound 
      checkPointSound.play();
      checkPointSound.lifetime=25;
    }
    
    //To call other functions in draw function for execution
    obstacles();
    colour1();
    colour2();
  }
  else if(gameState===END)
  {
    //To make restart & game Over invisible
    gameOver.visible=true;
    restart.visible=true;
    
    //Destroying objects and setting up their velocity 0 when the     game ends
    ground.velocityX=0
    colour1Group.setVelocityEach(0);
    colour1Group.destroyEach();
    colour2Group.setVelocityEach(0);
    colour2Group.destroyEach();
    obsGroup.setVelocityEach(0);
    obsGroup.destroyEach();
  }
  
  if(ground.x<0)
  {
    //To give infinite scrolling effect to ground
    ground.x=ground.width/2;
  }

  //To make monkey collide with the ground
  man.collide(ground);
  
  //End state condition
  if(chances===0||survivalTime===0)
  {
    gameState=END;
  }
  
  //To restart the game when clicked on restart button
  if(mousePressedOver(restart))
  {
    //Calling restart function
    reset();
  }

  
  //To draw the sprites
  drawSprites();
  
  //Displaying scoring & losing system
  fill("black");
  textSize(18);
  text("Score Board: "+score,20,35);
  text("Survival Time: "+survivalTime,450,35);
  text("Chances: "+chances,250,35);
  
  
}


function obstacles()
{
  //To make obstacles appear at interval of 130 frames
  if(frameCount%170===0)
  {
  //To create obstacle sprite
  obstacle=createSprite(width,height-70,10,10);
  //To add image to banana
  obstacle.addImage(obstacle_img);
  //Scaling to adjust banana
  obstacle.scale=0.15;
  //To assign velocity to banana
  obstacle.velocityX=-(4+score/15);
  //To assign lifetime to banana to avoid memory leaks
  obstacle.lifetime=width/obstacle.velocity;
  //Adding obstacles to obsgroup
  obsGroup.add(obstacle);
  }
}

function colour1()
{
  //To make banana appear at interval of 150 frames
  if(frameCount%150===0)
  {
    //To create banana sprite
    colourfirst=createSprite(600,Math.round(random(120,270)),10,10);
    //To add image to banana
    colourfirst.addImage(colour1_img);
    //To assign velocity to banana
    colourfirst.velocityX=-(3.5+score/10);
    //Scaling to adjust image
    colourfirst.scale=0.3;
    //To assign lifetime to banana
    colourfirst.lifetime=width/colourfirst.velocity;
    //Add banana to foodgroup
    colour1Group.add(colourfirst);
  }
  
}

function colour2()
{
  //To make orange appear at interval of 250 frames
  if(frameCount%250===0)
  {
  //To create orange sprite
  colourbest=createSprite(width,Math.round(random(height-360,height-250)),10,10);
  //To add image to orange 
  colourbest.addImage(colour2_img);
  //Scaling to adjust the image
  colourbest.scale=0.3;
  //To assign velocity to orange
  colourbest.velocityX=-(5+score/8);
  //To assign velocity to orange
  colourbest.lifetime=width/colourbest.velocity;
  //To add orange to orangegroup
  colour2Group.add(colourbest);
  }
}

function reset()
{
  //Initial 
  gameState=PLAY;
  score=0;
  chances=3;
  survivalTime=10;
  gameOver.visible=false;
  restart.visible=false;
}