function Predator( x, y ){
    this.position = new Vector(x, y);
    this.angle = 0;
    this.velocity = new Vector( 
                        randomUniform( -2, 2 ), 
                        randomUniform( -2, 2 )
                    );
    
    this.color = "#a6fce8";
    this.size = 5;
    
    this.target = null;
    this.fed = 0;
}

Predator.prototype.update = function( neighbors, predators, obstacles, dt  ){
    var accelNearest = calculateClosestBoidForce( this, neighbors );
    var accelGroup = calculateCohesionForce( this, neighbors );
    var accelSeparate = calculateAvoidance( this, predators );
    var avoid_objects = calculateCleverAvoidance( this, obstacles );
    
    accelNearest.idivide( accelNearest.length() );
    accelGroup.idivide( accelGroup.length() );
    accelSeparate.idivide( accelSeparate.length() );
    avoid_objects.idivide( avoid_objects.length() );
    
    
    var acceleration = new Vector( 0, 0 );
    acceleration.iadd( accelNearest.imultiply( 70 ) );
    acceleration.iadd( accelGroup.imultiply( cohesionWeight*0.01 ) );
    acceleration.iadd( accelSeparate.imultiply( separationWeight ) );
    acceleration.iadd( avoid_objects.imultiply( avoidObjectsWeight ) );
    
    
    if( acceleration.length() > maxAccelPredator ){
        var normalized = acceleration.divide( acceleration.length() );
        acceleration = normalized.multiply( maxAccelPredator );
    }
    
    if ( acceleration.length() == 0 )
        var velocity = this.velocity.add( new Vector( maxVel/2, maxVel/2 ) );
    else  
        var velocity = this.velocity.add( acceleration );
    
    
    if( velocity.length() > maxVelPredator ){
        var normalized = velocity.divide( velocity.length() );
        velocity = normalized.multiply( maxVelPredator );
    }
    
    
    if( velocity.length() != 0 ){
        var direction = Math.atan2( velocity.y, velocity.x );
        this.angle = direction;// radians (direction*180/Math.PI) % 360;// degrees
    }
    
    this.velocity = velocity;
    this.position.iadd( velocity.multiply( dt ) );
    
    this.position.x = this.position.x < 10 ? screenWidth - 10 - this.position.x : Math.max(this.position.x % (screenWidth-10), 10);
    this.position.y = this.position.y < 10 ? screenHeight - 10 - this.position.y : Math.max(this.position.y % (screenHeight-10), 10);
}

Predator.prototype.eatBoid = function( boid ){
    boid.eaten = true;
    this.fed += 1;
    this.target = null;
}

Predator.prototype.draw = function( context ){
    var x = this.position.x;
    var y = this.position.y;
    
    visual.drawArcStroked( x, y, this.size, this.color );
    visual.drawLine( x, y, x+this.velocity.x, y+this.velocity.y );
}