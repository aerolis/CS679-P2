//set up canvas and webgl vars
var canvas;
var gl;

var shaderProgram;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();  
var mvMatrixStack = [];

var statics = new Array();
var path = "";

//play state variables
//var meshesLoaded = false;
var playState = 0;
var human = new player();
var cam = new camera();
var asteroids = new Array();
var enemies = new Array();
var items = new Array();
var lasers = new Array();
var levelBackground = new background();
var enemyCt = 0;

var levelLength = 10000;

//load in model files
var models = new Array();
var meshNum = 0;
var modelsChecked = 0;
var totalModels = 1;

$.get("meshes/meshids.html", function(data){
	getMeshes(data);
}, 'html');

T = setTimeout("initGame()", 1/60 * 1000);

function initGame() //begin the game initialization
{
	//set up drawing
	canvas = document.getElementById("myCanvas");
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

	// now we can do standard OpenGL stuff
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

	T = setTimeout("gameLoop()", 1/60 * 1000);
}

function setupGame()
{
	//initPyramid();
	//initialize all loaded meshes
	initObjects();
	//initialize lights
	initLights();
	// make the shaders
	initShaders();
	//start the game loop
}

function checkLoaded()
{
	if (modelsChecked < totalModels)
		return false;
	else
		return true;
}
function gameLoop()
{
	switch (playState)
	{
		case 0: //loading screen and instructions
			if (checkLoaded)
			{
				setupGame();
				playState++;
			}
			break;
		case 1: //level select
			draw();
			update();
			break;
		case 2: //play selected level
			break;
		case 3: //level breakdown after,
			break;
	}
	T = setTimeout("gameLoop()", 1/60 * 1000);
}


function update(){
	//run update code here
	statics[0].rot.x += .5;
	statics[0].rot.x%360;
	
	human.update();
	cam.update();
}


function initObjects()
{
	statics.push(new static(new v3(0,0,-250),new v3(0,0,0),new v3(1,1,1),1));
	//models[0].initMaterials();
	//models[1].initMaterials();
	//statics[0].bindMesh();
	//human.bindMesh();
		
	var i,j;
	for (i=0;i<models.length;i++)
	{
		models[i].initMaterials();
		for (j=0;j<models[i].meshes.length;j++)
		{
			models[i].meshes[j].bindMesh();
		}
	}	

	human.screenPos = new v3(0,-30,-150);
	
}

function detectCollisions()
{
	var i,j;
	//check player against asteroids
	for (i=0;i<asteroids.length;i++)
	{
		var distance = human.pos-asteroids[i].pos;
		if(distance < asteroids[i].radius)
		{//collision
			//damage player
		}
	}
	
	//check player against items
	for (i=0;i<items.length;i++)
	{
		var distance = human.pos-items[i].pos;
		if(distance < items[i].radius)
		{//collision
			human.numBombs++;
		}
	}
	//check player against enemies
	for (i=0;i<enemies.length;i++)
	{
		var distance = human.pos-enemies[i].pos;
		if(distance < enemies[i].radius)
		{//collision
			//damage player
		}
	}
	
	//check lasers against asteroids
	for (i=0;i<asteroids.length;i++)
	{
		for (j=0;j<lasers.length;j++)
		{
			var distance = lasers[j].pos-asteroids[i].pos;
			if(distance < asteroids[i].radius-10)
			{//collision
				//damage asteroid
			}
		}
	}
	//check lasers against enemies
	for (i=0;i<enemies.length;i++)
	{
		for (j=0;j<lasers.length;j++)
		{
			var distance = lasers[j].pos-enemies[i].pos;
			if(distance < enemies[i].radius-10)
			{//collision
				//damage enemy
			}
		}
	}
}

function transformVector(v3) {
    var vecRet = new v3(0,0,0);
    vecRet.x = v3.x - human.worldPos.x + human.screenPos.x;
    vecRet.y = v3.y - human.worldPos.y + human.screenPos.y;
    vecRet.z = v3.z - human.worldPos.z + human.screenPos.z;
    return vecRet;
}

//add event listeners
window.addEventListener('keydown',handleKeyDown,true);
window.addEventListener('keyup',handleKeyUp,true);
window.addEventListener('mousemove',handleMouseMove,true);
//window.addEventListener('mousedown',handleMouseDown,true);