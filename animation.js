var reqAnimFrame = 
           window.requestAnimationFrame    ||
           window.mozRequestAnimationFrame    ||
           window.webkitRequestAnimationFrame ||
           window.msRequestAnimationFrame     ||
           window.oRequestAnimationFrame
           ;

function run( last_draw ){
   if( viewModel.running ){
       if( !!!last_draw ){
           // parameter last_draw wasn's specified
           last_draw = new Date().getMilliseconds();
       }
       
       var now = new Date().getMilliseconds();
       var dt = Math.max(now - last_draw, 1);       // time passed since last draw
       var afterTime = new Date().getMilliseconds();
       
       updateBoids( dt*0.03 );
       drawBoids();
       
       
       
       reqAnimFrame( function(){ 
           run( afterTime );
       });
   }
}


function drawBoids(){
    visual.clear();
    visual.context.save();
    
    for( var i=0;i<viewModel.obstacles.length;i++ )
        viewModel.obstacles[i].draw( viewModel.context );
    
    for( var i=0;i<viewModel.boids.length;i++ )
        viewModel.boids[i].draw( viewModel.context );
    
    for( var i=0;i<viewModel.predators.length;i++ )
        viewModel.predators[i].draw( viewModel.context );
    
    visual.context.restore();
}

function updateBoids( dt ){
    neighborRadius = parseFloat(viewModel.neighborRadius());
    screenWidth = viewModel.width;
    screenHeight = viewModel.height;
    
    visionAngle = 280; // realistic -> 280
    
    maxAccel = 2;
    maxVel = 4;
    maxAccelPredator = maxAccel+1;
    maxVelPredator = maxVel+2;
    
    separationWeight = parseFloat( viewModel.separationWeight() );
    alignmentWeight = parseFloat( viewModel.alignmentWeight() )*0.01;
    cohesionWeight = parseFloat( viewModel.cohesionWeight() )*0.01;
    avoidPredatorsWeight = parseFloat( viewModel.avoidPredatorsWeight() );
    avoidObjectsWeight = parseFloat( viewModel.avoidObjectsWeight() );
    
    boidRTree = new rbush(20);
    predatorRTree = new rbush(4);
    obstacleRTree = new rbush(9);
    
    var entries = [];
    for( var y=0; y<viewModel.boids.length; y++ ){
        var boid = viewModel.boids[y];
        entries.push( [ boid.position.x-boid.size, boid.position.y-boid.size, boid.position.x+boid.size, boid.position.y+boid.size, boid ] );
    }
    boidRTree.load( entries );
    
    
    var entries = [];
    for( var y=0; y<viewModel.predators.length; y++ ){
        var predator = viewModel.predators[y];
        entries.push( [ predator.position.x-predator.size, predator.position.y-predator.size, predator.position.x+predator.size, predator.position.y+predator.size, predator ] );
    }
    predatorRTree.load( entries );
    
    var entries = [];
    for( var y=0; y<viewModel.obstacles.length; y++ ){
        var obstacle = viewModel.obstacles[y];
        entries.push( [ obstacle.position.x-obstacle.size, obstacle.position.y-obstacle.size, obstacle.position.x+obstacle.size, obstacle.position.y+obstacle.size, obstacle ] );
    }
    obstacleRTree.load( entries );
    
    
    for( var i=0;i<viewModel.predators.length;i++ ){
        var predator = viewModel.predators[i];
        
        var surroundings = [
           Math.max(predator.position.x - neighborRadius, 0),
           Math.max(predator.position.y - neighborRadius, 0),
           Math.max(predator.position.x + neighborRadius, 0),
           Math.max(predator.position.y + neighborRadius, 0),
        ];

        var retrieved = boidRTree.search( surroundings );
        var nearbyBoids = [];
        for( var y=0; y<retrieved.length; y++ ){
           var neighbor = retrieved[y][4];
           var distance = neighbor.position.subtract( predator.position ).length();
           if (distance <= neighborRadius ){
               if (distance-predator.size-neighbor.size <= 0 )
                   predator.eatBoid( neighbor );
               else{
                nearbyBoids.push( neighbor );
                neighbor.panicked = true;
               }
           }
        }
        
        // remove eaten boids
        viewModel.boids = viewModel.boids.filter( function(elem){return !elem.eaten} );

        var retrieved = predatorRTree.search( surroundings );
        var nearbyPredators = [];
        for( var y=0; y<retrieved.length; y++ ){
           var neighbor = retrieved[y][4];
           if ( predator != neighbor ){
               nearbyPredators.push( neighbor )
           }
        }

        var retrieved = obstacleRTree.search( surroundings );
        var nearbyObstacles = [];
        for( var y=0; y<retrieved.length; y++ ){
           var obstacle = retrieved[y][4];
           nearbyObstacles.push( obstacle )
        }
        
        predator.update( nearbyBoids, nearbyPredators, nearbyObstacles, dt );
    }
    
    
    for( var i=0;i<viewModel.boids.length;i++ ){
        var individual = viewModel.boids[i];
        
        var surroundings = [
           Math.max(individual.position.x - neighborRadius, 0),
           Math.max(individual.position.y - neighborRadius, 0),
           Math.max(individual.position.x + neighborRadius, 0),
           Math.max(individual.position.y + neighborRadius, 0),
        ];
        
        var retrieved = boidRTree.search( surroundings );
        var nearbyBoids = [];
        for( var y=0; y<retrieved.length; y++ ){
            var neighbor = retrieved[y][4];
            if ( individual != neighbor ){
                nearbyBoids.push( neighbor )
            }
        }
        
        var retrieved = predatorRTree.search( surroundings );
        var nearbyPredators = [];
        for( var y=0; y<retrieved.length; y++ ){
            var predator = retrieved[y][4];
            nearbyPredators.push( predator )
        }
        
        var retrieved = obstacleRTree.search( surroundings );
        var nearbyObstacles = [];
        for( var y=0; y<retrieved.length; y++ ){
            var obstacle = retrieved[y][4];
            nearbyObstacles.push( obstacle )
        }
        
        individual.update( nearbyBoids, nearbyPredators, nearbyObstacles, dt );
        
    }
}