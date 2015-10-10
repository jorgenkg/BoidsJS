function Bird( x, y ){
    this.panicked = false;
    this.eaten = false;
    this.position = new Vector(x, y);
    this.angle = 0;
    this.size = 3;
    
    this.velocity = new Vector( 
                        randomUniform( -2, 2 ), 
                        randomUniform( -2, 2 )
                    );
    
    this.color = getRandomColor();
}

Bird.prototype.update = function( neighbors, nearbyPredators, nearbyObstacles, dt  ){
    var avoid_predators = calculateAvoidance( this, nearbyPredators );
    var concentrate = calculateCohesionForce( this, neighbors );
    var align = calculateAlignmentForce( this, neighbors );
    var separate = calculateAvoidance( this, neighbors );
    var avoid_objects = calculateCleverAvoidance( this, nearbyObstacles );
    
    avoid_predators.idivide( avoid_predators.length() );
    concentrate.idivide( concentrate.length() );
    align.idivide( align.length() );
    separate.idivide( separate.length() );
    avoid_objects.idivide( avoid_objects.length() );
    
    
    var acceleration = new Vector(0, 0);
    var sign = this.panicked ? -1 : 1;
    
    acceleration.iadd( avoid_objects.multiply( avoidObjectsWeight ) );
    acceleration.iadd( avoid_predators.multiply( avoidPredatorsWeight ) );
    acceleration.iadd( separate.multiply( separationWeight ) );
    
    
    if( viewModel.flocking() ){
        acceleration.iadd( align.multiply( alignmentWeight ).multiply(sign) );
        acceleration.iadd( concentrate.multiply( cohesionWeight ).multiply(sign) );

    }
    
    if( acceleration.length() > maxAccel ){
        var normalized = acceleration.divide( acceleration.length() );
        acceleration = normalized.multiply( maxAccel );
    }
    
    if ( acceleration.length() == 0 )
        var velocity = this.velocity.add( new Vector( maxVel/2, maxVel/2 ) );
    else  
        var velocity = this.velocity.add( acceleration );
    
    
    var velocity = this.velocity.add( acceleration );
    
    
    if( velocity.length() > maxVel ){
        var normalized = velocity.divide( velocity.length() );
        velocity = normalized.multiply( maxVel );
    }
    
    
    if( velocity.length() != 0 ){
        var direction = Math.atan2( velocity.y, velocity.x );
        this.angle = (direction*180/Math.PI) % 360;
    }
    
    this.velocity = velocity;
    this.position.iadd( velocity.multiply( dt ) );
    
    this.position.x = this.position.x < 10 ? screenWidth - 10 - this.position.x : Math.max(this.position.x % (screenWidth-10), 10);
    this.position.y = this.position.y < 10 ? screenHeight - 10 - this.position.y : Math.max(this.position.y % (screenHeight-10), 10);
    
    this.panicked = false;   
}

Bird.prototype.draw = function( context ){
    var x = this.position.x;
    var y = this.position.y;
    
    visual.drawArc( x, y, this.size, this.color );
    visual.drawLine( x, y, x+this.velocity.x*2, y+this.velocity.y*2 );
    
}