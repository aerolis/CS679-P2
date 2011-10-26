function player ()
{
	this.yaw = 0;
	this.pitch = 0;
	this.roll = 0;
	this.pos = new v3(0,0,0);
	this.zScreenPos = 0;
	this.lives = 5;
	this.fireTimeout = 0;
	this.numBombs = 3;
	
	this.rollAngles = new Array();
	for(var i = 0; i < 10; i++)
	{
		
	}
	
	this.fwd;
	this.bck;
	this.right;
	this.left;
}

player.prototype.fireMain = function()
{
	this.fireTimeout = 50;
}

player.prototype.bindMesh = function()
{	
	var i;
	for (i=0;i<models[0].meshes.length;i++)
	{
		models[0].meshes[i].bindMesh();
	}
}

player.prototype.update = function()
{
	if(this.left)
	{
		this.pos.x -= 2;
		this.pos.x = Math.max(this.pos.x,-200);
	}
	if(this.right)
	{
		this.pos.x += 2;
		this.pos.x = Math.min(this.pos.x,200);
	}
	if(this.fwd)
	{
		this.zScreenPos -= 2;
		//this.zScreenPos = Math.max(this.pos.x,0);
	}
	if(this.bck)
	{
		this.zScreenPos += 2;
		//this.zScreenPos = Math.min(this.pos.x,400);
	}
	this.pos.z = cam.pos.z + this.zScreenPos;
}