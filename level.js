function level()
{
	this.events = new Array();
	this.length = 1000;
	this.id;
	this.loaded = false;
}

level.prototype.doEvents = function()
{
	var i;
	for (i=0;i<this.events.length;i++)
	{
		if (this.events[i].zpos <= -cam.pos.z && !(this.events[i].triggered))
		{
			this.events[i].doEvent();
			this.events[i].triggered = true;
		}
	}
}

function event()
{
	this.type;
	this.zpos;
	this.pos;
	this.amount;
	this.behavior;
	this.phase;
	this.model;
	this.radius;
	this.triggered = false;
}
event.prototype.doEvent = function()
{
	//code to do event here
	//now doing event
	var i;
	switch (this.type)
	{
		case "asteroid":
			for (i=0;i<this.amount;i++)
			{
				//asteroids.push(new asteroid(this.pos,this.phase));
			}
			break;
		case "enemy_swarm":
			for (i=0;i<this.amount;i++)
			{
				enemies[enemyCt] = new enemy(enemyCt);
				enemies[enemyCt].pos = this.pos;
				enemies[enemyCt].phase = this.phase;
				enemies[enemyCt].model = this.model;
				enemies[enemyCt].radius = this.radius;
				switch (this.behavior)
				{
					case "simple_track":
						enemies[enemyCt].behavior = new followBehavior(.5,5);
						break;
				}
				enemies[enemyCt].init();
				enemyCt++;
			}
			break;
	}
}

function load_level(data)
{
	var levr = new level();
	var eventNum = 0;
	var lines = data.split('\n');
	for (i in lines)
	{
		var tokens = lines[i].split(' ');
		switch (tokens[0])
		{
			case "//":
				//comment line, do nothing
				break;
			case "<level>":
				//initialize level
				break;
			case "</level>":
				//close level
				break;
			case "<id>":
				levr.id = tokens[1];
				break;
			case "<length>":
				levr.length = tokens[1];
				break;
			case "<event>":
				//start event
				levr.events.push(new event());
				break;
			case "<zpos>":
				levr.events[eventNum].zpos = tokens[1];
				break;
			case "<type>":
				levr.events[eventNum].type = tokens[1];
				break;
			case "<amount>":
				levr.events[eventNum].amount = parseInt(tokens[1]);
				break;
			case "<phase>":
				levr.events[eventNum].phase = parseInt(tokens[1]);
				break;
			case "<model>":
				levr.events[eventNum].model = parseInt(tokens[1]);
				break;
			case "<radius>":
				levr.events[eventNum].radius = parseInt(tokens[1]);
				break;
			case "<pos>":
				levr.events[eventNum].pos = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),-parseFloat(tokens[3]));
				break;
			case "<behavior>":
				levr.events[eventNum].behavior = tokens[1];
				break;
			case "</event>":
				eventNum++;
				break;
		}
	}
	levr.loaded = true;
	return levr;
}