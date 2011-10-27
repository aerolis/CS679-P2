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
	this.flash = false;
	this.hit_timer = 0.0;
}
enemy.prototype.init = function()
{
	this.pos = new v3(this.pos.x+Math.random()*100,0,this.pos.z+Math.random()*100);
	this.vel = new v3(Math.random()*4-2,0,Math.random()*2-1);
	this.rotVel = new v3(0,Math.random()*5,0);
}
enemy.prototype.initSimple = function()
{
	this.vel = new v3(Math.random()*4-2,0,Math.random()*2-1);
	this.rotVel = new v3(0,Math.random()*4,0);
}
enemy.prototype.draw = function()
{
}
enemy.prototype.update = function()
{
	if (this.hit_timer > 0.0)
	{
		this.hit_timer--;
		if (this.hit_timer <= 0.0)
			this.flash = false;
	}
	
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
	if (this.hit_timer <= 0.0 && type == 1)
	{
		this.hp--;
		if (this.hp <= 0)
		{
			this.dropItem();
			this.killed();
		}
		this.hit_timer = 30.0;
		this.flash = true;
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
	if (Math.random() < this.dropRate)
	{
		items[itemCt] = new bomb(itemCt);
		items[itemCt].pos = this.pos;
		itemCt++;
	}
}
function enemyDie(id)
{
	enemies[id] = null;
}