HUNTING_RADIUS = 100;

function calculateCohesionForce( individual, neighbors ){
    neighbors = viewModel.boids;
    if( neighbors.length == 0 )
        return new Vector(0,0);
    
    var cohesionVelocity = new Vector(0, 0);
    
    for( var i=0; i<neighbors.length; i++ ){
        cohesionVelocity.iadd( neighbors[i].position );
    }
    
    var cohesionVelocity = cohesionVelocity.divide( neighbors.length );
    cohesionVelocity = cohesionVelocity.subtract(individual.position)
    
    return cohesionVelocity;
}


function calculateAlignmentForce( individual, neighbors ){
    if( neighbors.length == 0 )
        return new Vector(0,0);
    
    var alignmentVelocity = new Vector(0, 0);
    
    for( var i=0; i<neighbors.length; i++ ){
        alignmentVelocity.iadd( neighbors[i].velocity );
    }
    
    alignmentVelocity.divide( neighbors.length );
        
    return alignmentVelocity;
}


function calculateAvoidance( individual, neighbors ){
    if( neighbors.length == 0 )
        return new Vector(0,0);
    
    var personalSpace = parseFloat( viewModel.personalSpace() );
    var separationVelocity = new Vector(0, 0);
    
    for( var i=0; i<neighbors.length; i++ ){
        var neighbor = neighbors[i];
        var distanceVector = neighbor.position.subtract(individual.position);
        var distance = distanceVector.length() - neighbor.size - individual.size ; 
        
        if ( distance <= 0 ){
            if( neighbor.velocity )
                separationVelocity.isubtract( neighbor.velocity.multiply(100000) );
            else
                separationVelocity.isubtract( distanceVector.multiply(100000) );
        }
        else if ( distance <= personalSpace )
            separationVelocity.isubtract( distanceVector );
        else
            separationVelocity.isubtract( distanceVector.multiply( 1.0/(distance*distance) ) );
    }
    
    return separationVelocity;
}


function calculateCleverAvoidance( individual, obstacles ){
    var personalSpace = parseFloat( viewModel.personalSpace() );
    var cleverAvoidanceForce = new Vector(0, 0);
    
    for( var i=0; i<obstacles.length; i++ ){
        var obstacle = obstacles[i];
        
        var distanceVector = obstacle.position.subtract(individual.position);
        var distance = distanceVector.length();
        
        if ( distance - obstacle.size - individual.size - maxVelPredator <= 0 ){
            return distanceVector.multiply(-1);
        }
        else{
            var normalVector = new Vector( -distanceVector.y, distanceVector.x );
            
            var avoidmargin = (obstacle.size + individual.size + maxVelPredator + 100) / distanceVector.length();
            var correctionFactor = (obstacle.size + individual.size + personalSpace + avoidmargin ) / normalVector.length();
            normalVector.imultiply( correctionFactor );
    
            var edgeVector = distanceVector.add( normalVector );
    
            var edgeAngle = vectorAngle( distanceVector, edgeVector );
            var speedAngle = vectorAngle( distanceVector, individual.velocity );
    
            if( Math.abs(speedAngle) > Math.abs(edgeAngle) ){
                // we are already avoiding this object
            }
            else{
                var sign = speedAngle >= 0 ? 1 : -1;
                var correctionFactor = normalVector.length() / edgeVector.length();
                
                cleverAvoidanceForce.iadd( edgeVector.normal().multiply( sign*correctionFactor  ) );
            }
        }
    }
    
    return cleverAvoidanceForce;
}

function vectorAngle( vec1, vec2 ){
    return Math.acos((vec1.x * vec2.x + vec1.y * vec2.y) / (vec1.length()*vec2.length()));
}


function calculateClosestBoidForce( predator, neighbors ){
    var nearest = null;
    var shortestD = Infinity;
    for( var i=0; i<neighbors.length; i++ ){
        var neighbor = neighbors[i];
        var distance = neighbor.position.subtract( predator.position ).length(); 
    
        if (distance < shortestD ){
            nearest = neighbor;
            shortestD = distance;
        }
    }
    
    if( nearest != null )
        var accelNearest = nearest.position.subtract( predator.position ).multiply( 1.0/shortestD );
    else
        var accelNearest = new Vector(0,0);
    
    return accelNearest;
}
