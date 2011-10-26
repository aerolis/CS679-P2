function enemy(id)
{
	this.id = id;
	this.pos = new v3(0,0,0);
	this.rot = new v3(0,0,0);
	this.scale = new v3(1,1,1);
	this.vel = new v3(0,0,0);
	this.rotVel = new v3(0,0,0);
	this.hp = 10;
	this.maxHP = 10;
	this.phase = 1;
	this.radius = 20;
	this.dropRate = 0.1;
	this.behavior;
	this.model;
}
enemy.prototype.init = function()
{
	this.pos = new v3(this.pos.x+Math.max(20,Math.random()*50),0,this.pos.z+Math.max(10,Math.random()*50));
	this.vel = new v3(Math.random()*2,0,Math.random()*2);
	this.rotVel = new v3(0,Math.random()*2,0);
}
enemy.prototype.draw = function()
{
}
enemy.prototype.update = function()
{
	var b = this.behavior;
	this.vel = b.update(this.vel,this.pos);
	
    this.pos = this.pos.add(this.vel); //translate distance based on velocity and passed time
	this.rot = this.rot.add(this.rotVel);
	//var theta = Math.acos(this.velocity.x/this.velocity.magnitude());
	if (this.pos.z > cam.pos.z+250)
	{
		this.offScreen();
	}
}
enemy.prototype.killed = function()
{
	this.die();
}
enemy.prototype.offScreen = function()
{
	enemyDie(this.id);
}
enemy.prototype.takeDamage = function(type)
{
	if (type == 1)
	{
		this.hp--;
	}
	else if (type == 2)
	{
		this.hp = 0;
		this.killed();
	}
}
enemy.prototype.die = function()
{
	this.dropItem();
	enemyDie(this.id);
}
enemy.prototype.dropItem = function()
{
	//to be done
}
function enemyDie(id)
{
	enemies[id] = null;
}