function asteroid(id){
	this.id;
	this.pos = new v3(0,0,0);
	this.rot = new v3(0,0,0);
	this.scale = new v3(1,1,1);
	this.rotVel = new v3(0,0,0);
	this.vel = new v3(Math.random()*4-2,0,Math.random()*1-.5);
	this.model = Math.round(Math.random()*3)+1;
	this.phase = 1;
	this.maxHP = 5;
	this.hp = 5;
	this.dropRate = .05;
	this.radius = 20;
	
}

asteroid.prototype.init = function()
{
	this.pos = new v3(this.pos.x+Math.random()*200,0,this.pos.z+Math.random()*100);
	//this.vel = new v3(Math.random()*2+this.vel.x,0,Math.random()*2+this.vel.z);
	this.rotVel = new v3(Math.random()*2,Math.random()*2,Math.random()*2);
}
asteroid.prototype.draw = function()
{
	//
}

asteroid.prototype.update = function() 
{
	this.pos = this.pos.add(this.vel);
	this.rot = this.rot.add(this.rotVel);
}
asteroid.prototype.takeDamage = function()
{
	this.hp--;
	if (this.hp <= 0)
	{
		this.dropItem();
		if (this.maxHP > 1)
			this.decay();
		asteroidDie(this.id);
	}
}
asteroid.prototype.decay = function()
{
	var i;
	var num = Math.round(4*Math.random())+1;
	for (i=0;i<num;i++)
	{
		asteroids[asteroidCt] = new asteroid(asteroidCt);
		asteroids[asteroidCt].radius = this.radius/2;				
		asteroids[asteroidCt].pos = this.pos;
		asteroids[asteroidCt].phase = this.phase;
		asteroids[asteroidCt].scale = new v3(this.scale.x/2,this.scale.y/2,this.scale.z/2);
		asteroidCt++;
	}
}
asteroid.prototype.dropItem = function()
{
	//later
}
function asteroidDie(id)
{
	asteroid[id] = null;
}