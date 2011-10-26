function enemy(id)
{
	this.id = id;
	this.pos = v3(0,0,0);
	this.rot = v3(0,0,0);
	this.scale = v3(1,1,1);
	this.vel = v3(0,0,0);
	this.rotVel = v3(0,0,0);
	this.hp = 10;
	this.maxHP = 10;
	this.phase = 1;
	this.radius = 10;
	this.dropRate = 0.1;
	this.behavior;
	this.model;
}
enemy.prototype.draw = function()
{
}
enemy.prototype.update = function()
{
	var b = this.behavior;
	this.vel = b.update();
	
    this.pos.add(this.vel); //translate distance based on velocity and passed time
	//var theta = Math.acos(this.velocity.x/this.velocity.magnitude());
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
		this.die();
	}
}
enemy.prototype.die = function()
{
	this.dropItem();
	enemies.die(id);
}
enemy.prototype.dropItem = function()
{
}