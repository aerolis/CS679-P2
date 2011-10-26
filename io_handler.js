function handleMouseMove(evt)
{
	if (playState == 1)
	{
		if ((evt.clientX-10)/canvas.width > .5)
		{
			human.yaw = Math.min(30,30*(canvas.width/2-Math.min((evt.clientX-10),canvas.width))/(canvas.width/2));
		}
		else if ((evt.clientX-10)/canvas.width < .5)
		{
			human.yaw = Math.max(-30,-30*((evt.clientX-10)-canvas.width/2)/(canvas.width/2));
		}
		else
		{
			human.yaw = 0;
		}
		/*if ((evt.clientY-10)/canvas.height > .5)
		{
			human.pitch = Math.min(30,30*(canvas.height/2-(evt.clientY-10))/(canvas.height/2));
		}
		else if ((evt.clientY-10)/canvas.height < .5)
		{
			human.pitch = Math.max(-30,-30*((evt.clientY-10)-canvas.height/2)/(canvas.height/2));
		}
		else
		{
			human.pitch = 0;
		}*/
	}
}
function handleKeyDown(evt) {
		switch (evt.keyCode) {
			case 38:  /* Up arrow was pressed */
				human.fwd = true;
			break;
			case 40:  /* Down arrow was pressed */
				human.bck = true;
			break;
			case 37:  /* Left arrow was pressed */
				human.left = true;
			break;
			case 39:  /* Right arrow was pressed */
				human.right = true;
			break;
		}
}
function handleKeyUp(evt) {
		switch (evt.keyCode) {
			case 38:  /* Up arrow was pressed */
				human.fwd = false;
			break;
			case 40:  /* Down arrow was pressed */
				human.bck = false;
			break;
			case 37:  /* Left arrow was pressed */
				human.left = false;
			break;
			case 39:  /* Right arrow was pressed */
				human.right = false;
			break;
			case 32: // space bar
				human.fireMain();
			break;
		}
}