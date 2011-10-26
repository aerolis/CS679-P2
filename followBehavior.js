function followBehavior(maxSpeed,maxTurn)
{
	this.maxSpeed = maxSpeed;
	this.maxTurn = maxTurn;
}

followBehavior.prototype.update = function(vel,loc) 
{
	var vel = this.step(vel,loc);
	return vel;
}

followBehavior.prototype.step = function (vel,loc) {
	var acceleration = this.steer_to(pt,vel,loc);
    return vel.add(acceleration).limit(this.maxSpeed); //limit the maximum speed a boid can go
}
followBehavior.prototype.steer_to = function(target,vel,loc)
{
       var desired = target.subtract(loc); //vector pointing from the location to the target
       var d = desired.magnitude(); //distance between this and the target
       if (d > 0) //if the distance is greater than 0
       {
              desired = desired.normalize(); //calculate steering
              if (d < 100.0) //bases desired vector magnitude on distance
              {
                     desired = desired.mult(this.maxSpeed*(d/100.0));
              }
              else //bases desired vector magnitude on MAX_SPEED
              {
                     desired = desired.mult(this.maxSpeed);
              }
              var steer = desired.subtract(vel); //steering equals desired vector minus velocity
              steer = steer.limit(this.maxTurn); //limit to maximum steering force
       }
       else //if the distance is less than or equal to zero
       {
              steer = new vector(0,0,0); //return zero vector
       }
       return steer;
}