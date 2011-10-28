function enemy(id)
{
	this.id = id;
	this.pos = new v3(0,0,0);
	this.rot = new v3(0,0,0);
	this.scale = new v3(1,1,1);
	this.vel = new v3(0,0,0);
	this.rotVel = new v3(0,0,0);
	this.hp = 5;
	this.maxHP = 5;
	this.phase = 1;
	this.radius = 20;
	this.dropRate = 0.05;
	this.behavior;
	this.model;
	this.flash = false;
	this.hit_timer = 0.0;
	this.ready = false;
}
enemy.prototype.init = function()
{
	this.pos = new v3(this.pos.x+Math.random()*100,this.pos,this.pos.z+Math.random()*100);
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
	if (this.ready)
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
		if (this.pos.z > cam.pos.z+300)
		{
			this.offScreen();
		}
	}
	else
	{
		this.pos.y -= 5;
		if (this.pos.y <= 0)
			this.ready = true;
	}
}
enemy.prototype.killed = function()
{
	this.die();
}
enemy.prototype.offScreen = function()
{
	enemies.splice(enemies.indexOf(this),1);
}
enemy.prototype.takeDamage = function(type)
{
	if (type == 1)
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
	var id = explosions.length;
	explosions.push(new explosion(id));
	explosions[id].initialScale = 1.5;	
	explosions[id].pos = this.pos;
	
	human.points += 10;
	drawScore();
	enemies.splice(enemies.indexOf(this),1);
}
enemy.prototype.dropItem = function()
{
	if (Math.random() < this.dropRate)
	{
		if (Math.random() > .2)
			items.push(new bomb(items.length));
		else
			items.push(new life(items.length));
		items[items.length-1].pos = this.pos;
	}
}
function enemyDie(id)
{
}