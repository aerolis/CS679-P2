function level()
{
	this.events = new Array();
	this.length = 1000;
	this.id;
}

level.prototype.doEvents = function()
{
	var i;
	for (i=0;i<this.events.length;i++)
	{
		if (events[i].zpos <= -cam.pos.z && !(events[i].triggered))
		{
			events[i].doEvent();
			events[i].triggered = true;
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
	this.triggered = false;
}
event.prototype.doEvent = function()
{
	//code to do event here
	//now doing event
	switch (this.type)
	{
		var i;
		case "asteroid":
			for (i=0;i<this.amount;i++)
			{
				asteroids.push(new asteroid(this.pos,this.phase));
			}
			break;
		case "enemy_swarm":
			for (i=0;i<this.amount;i++)
			{
				enemies[enemyCt] = new enemy(enemyCt);
				enemies[enemyCt].pos = this.pos;
				enemies[enemyCt].phase = this.phase;
				enemies[enemyCt].model = this.model;
				enemies[enemyCt].behavior = this.phase;
				enemyCt++;
			}
			break;
	}
}

function load_level(data)
{
	var lev = new level();
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
				lev.id = tokens[1];
				break;
			case "<length>":
				lev.length = tokens[1];
				break;
			case "<event>":
				//start event
				lev.events.push(new event());
				break;
			case "<zpos>":
				events[eventNum].zpos = tokens[1];
				break;
			case "<type>":
				events[eventNum].type = tokens[1];
				break;
			case "<amount>":
				events[eventNum].amount = parseInt(tokens[1]);
				break;
			case "<phase>":
				events[eventNum].phase = parseInt(tokens[1]);
				break;
			case "<model>":
				events[eventNum].model = parseInt(tokens[1]);
				break;
			case "<pos>":
				events[eventNum].pos = new v3(parseDouble(tokens[1]),parseDouble(tokens[2]),parseDouble(tokens[3]));
				break;
			case "<behavior>":
				events[eventNum].behavior = tokens[1];
				break;
			case "</event>":
				eventNum++;
				break;
		}
	}
	return lev;
}