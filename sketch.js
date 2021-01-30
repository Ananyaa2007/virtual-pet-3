var dog,happyDog,food,foodStock;
var databaase;
var foodS;
var fedthePet,addfood;
var feedTime,lastfed;
var gameState,readinggameState;
var bedroom,garden
var washroom;
var sadDog;
var foodObj;
var food=20;
var currentFeed;

function preload(){
 dogImg=loadImage("images/dogImg.png");
 happyDog=loadImage("images/dogImg1.png");
 bedroom=loadImage("images2/Bed Room.png");
 garden=loadImage("images2/Garden.png");
washroom=loadImage("images2/Wash Room.png");
sadDog=loadImage("images2/Lazy.png");
}

function setup(){
  createCanvas(700,1000);

  database = firebase.database();

  foodStock=database.ref("food");
  foodStock.on("value",readStock);

  feedTime=database.ref("feedTime");
  feedTime.on("value",function(data){
    lastfed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=database.ref()
  })

  
  foodObj=new Food();

  dog=createSprite(400,400,20,20)
  dog.addImage(dogImg)
  dog.scale=0.2;
 
  feed=createButton("Feed the dog")
  feed.position(700,95);
  feed.mousePressed(feedDogs)
 
  addFood=createButton("add food")
 addFood.position(800,95);
 addFood.mousePressed(addfood)
}

function draw() {  
background(46,139,87);

foodObj.display();

if(gameState != "hungry"){
  feed.hide()
  addFood.hide()
 // dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

   currentFeed=hour();
   if(currentFeed==(lastfed+1)){
     update("playing")
     dog.addImage(garden);
     dog.scale=1.6
   }

   else if(currentFeed==(lastfed+2)){
     update("sleeping")
     dog.addImage(bedroom);
     dog.scale=1.6
   }

   else if(currentFeed>(lastfed+2) && currentFeed<=(lastfed+4)){
     update("bathing");
     dog.addImage(washroom);
     dog.scale=1.6;
   }
   
   else if(currentFeed>(lastfed-1)){
     update("hungry");
     feed.show();
     addFood.show();
     dog.addImage(dogImg);
   }

  drawSprites();
  fill("black");
  textSize(26);

  if(lastfed>=12){
    text("Last feed: "+lastfed%12 +"p.m.",150,50)
  }else if(lastfed == 0){
    text("Last feed: 12a.m.",150,30)
  }else{
    text("Last feed: "+lastfed +"a.m.",150,50)
  }

}

function readStock(data){
  foodS=data.val()
}
function addfood(){
foodS++
database.ref("/").update({
  food:foodS
})
  dog.addImage(dogImg)
  foodObj.updateFoodStock(foodS);
}
function feedDogs(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodS-1);
  database.ref("/").update({
    food : foodObj.getFoodStock(),
    feedTime : hour()
  })
}function update(state){
  database.ref('/').update({
    gamestate:state
  })
}