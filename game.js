//set up canvas and webgl vars
var canvas;
var gl;

var shaderProgram;
var shaderProgram_main;
var shaderProgram_flash;
var shaderProgram_phase;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();  
var mvMatrixStack = [];

var statics = new Array();
var path = "";

//play state variables
//var meshesLoaded = false;
var playState = 0;
var time = 0;
var human = new player();
var cam = new camera();
var asteroids = new Array();
var enemies = new Array();
var items = new Array();
var lasers = new Array();
var levelBackground = new background();
var asteroidCt = 0;
var enemyCt = 0;
var itemCt = 0;
var levNum = 1;
var lev = new level();

var levelLength = 10000;

//load in model files
var models = new Array();
var meshNum = 0;
var modelsChecked = 0;
var totalModels = 1;
var doOnce = false;

T = setTimeout("drawLevelMenu()", 1/100 * 1000);

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
function setupLevel()
{
	$.get("levels/l"+levNum+".html", function(data){
	lev = load_level(data);
	levelLength = lev.length;
	}, 'html');
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
			if (checkLoaded && !doOnce)
			{
				pausecomp(100);
				doOnce = true;
				setupGame();
				setupLevel();
			}
			if (lev.loaded == true && checkLoaded)
				playState++;
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
	//statics[0].rot.x += .5;
	//statics[0].rot.x%360;
	time += 1;
	time & 314;
	
	lev.doEvents();
	var i;
	for (i=0;i<enemies.length;i++)
	{
		if (enemies[i] != null)
			enemies[i].update();
	}
	for (i=0;i<asteroids.length;i++)
	{
		if (asteroids[i] != null)
			asteroids[i].update();
	}
	human.update();
	cam.update();
	detectCollisions();
}


function initObjects()
{
	//statics.push(new static(new v3(0,0,-250),new v3(0,0,0),new v3(1,1,1),1));
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
		if (asteroids[i] != null && asteroids[i].phase == human.phase)
		{
			var distance = human.pos.subtract(asteroids[i].pos).magnitude();
			if(distance < asteroids[i].radius)
			{//collision
				//damage player
				human.takeDamage();
			}
		}
	}
	
	//check player against items
	for (i=0;i<items.length;i++)
	{
		if (items[i] != null)
		{
			var distance = human.pos.subtract(items[i].pos).magnitude();
			if(distance < items[i].radius)
			{//collision
				human.numBombs++;
			}
		}
	}
	//check player against enemies
	for (i=0;i<enemies.length;i++)
	{
		if (enemies[i] != null && enemies[i].phase == human.phase)
		{
			var distance = human.pos.subtract(enemies[i].pos).magnitude();
			if(distance < enemies[i].radius)
			{//collision
				//damage player
				human.takeDamage();
				console.log("player was hit");
			}
		}
	}
	
	//check lasers against asteroids
	for (i=0;i<asteroids.length;i++)
	{
		if (asteroids[i] != null)
		{
			for (j=0;j<lasers.length;j++)
			{
				if (lasers[i] != null && asteroids[i].phase == lasers[j].phase)
				{
					var distance = lasers[j].pos.subtract(asteroids[i].pos).magnitude();
					if(distance < asteroids[i].radius-10)
					{//collision
						//damage asteroid
					}
				}
			}
		}
	}
	//check lasers against enemies
	for (i=0;i<enemies.length;i++)
	{
		if (enemies[i] != null)
		{
			for (j=0;j<lasers.length;j++)
			{
				if (lasers[i] != null && enemies[i].phase == lasers[j].phase)
				{
					var distance = lasers[j].pos.subtract(enemies[i].pos).magnitude();
					if(distance < enemies[i].radius-10)
					{//collision
						//damage enemy
					}
				}
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

function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
} 

//add event listeners
window.addEventListener('keydown',handleKeyDown,true);
window.addEventListener('keyup',handleKeyUp,true);
window.addEventListener('mousemove',handleMouseMove,true);
//window.addEventListener('mousedown',handleMouseDown,true);