function Obstacle( x, y ){
    this.position = new Vector(x, y);
    
    this.size = 20;
    this.color = "#ff0000";
}

Obstacle.prototype.draw = function( context ){
    var x = this.position.x;
    var y = this.position.y;
    
    visual.drawArcStroked( x, y, this.size, this.color );
}