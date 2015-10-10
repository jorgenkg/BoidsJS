ko.bindingHandlers.slider = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
            
            $(element).val(valueUnwrapped).slider('refresh');
            
            ko.utils.registerEventHandler(element, "change", function (event, ui) {
                var value = valueAccessor(); // This is a ko.observable()
                value( $(element).val() );	// Set the parameter value
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);

            $(element).val(valueUnwrapped).slider('refresh');
        }
    };


$(document).bind('pagecreate', function(event, ui) {
    $('[data-role="content"]').css("height", $("body").height());
    
    viewModel = {
        running: true,
        
        boids: [],
        obstacles: [],
        predators: [],
        
        flocking: ko.observable( true ),
        
        // normal run
        separationWeight: ko.observable(25),
        alignmentWeight: ko.observable(50),
        cohesionWeight: ko.observable(2),
        avoidPredatorsWeight: ko.observable(10000),
        avoidObjectsWeight: ko.observable(20000),
        personalSpace: ko.observable(25),
        neighborRadius: ko.observable(100),
        
        addObstacle: function(){},
        addPredator: function(){},
        clearObstaclesAndPredators: function(){
            viewModel.obstacles = [];
            viewModel.predators = [];
        },
        
        toggleAnimation: function(){
            if( viewModel.running )
                viewModel.running = false;
            else {
                viewModel.running = true;
                run();
            }
        }
    };
    
    viewModel.addObstacle = function(){
        var x = randomUniform( 50, viewModel.width-50 );
        var y = randomUniform( 50, viewModel.height-50 );
        
        viewModel.obstacles.push(
                new Obstacle( x, y )
            );
    }
    
    viewModel.addPredator = function(){
        var x = randomUniform( 20, viewModel.width-20 );
        var y = randomUniform( 20, viewModel.height-20 );
        
        viewModel.predators.push(
                new Predator( x, y )
            );
    }
});





$(document).bind('pagecontainershow', function(event, ui) {
    var $overlay = $("#canvas");
    $overlay.attr("width", $overlay.parent().outerWidth()-10);
    $overlay.attr("height", $overlay.parent().outerHeight()-10);
    
    $overlay.css("margin-top","5px");
    $overlay.css("margin-left","5px");
    
    viewModel.width = parseInt($("#canvas").attr("width"));
    viewModel.height = parseInt($("#canvas").attr("height"));
    
    var population = [];
    for(var i=0;i<200;i++){
        var x = Math.random() * randomUniform( 0, viewModel.width );
        var y = Math.random() * randomUniform( 0, viewModel.height );
        population.push( new Bird( x, y ) );
    }
    viewModel.boids = population;
    
    viewModel.boids[0].color="#000000";
    viewModel.boids[1].color="#ffffff";
    
    ko.applyBindings(viewModel, $("#main-page")[0]);
    
    visual = new VisualizationEngine( document.getElementById("canvas").getContext("2d") );
    run(); // start animation
});
