
function VisualizationEngine( context ){
    this.context = context;
    
    this.width = viewModel.width;
    this.height = viewModel.height;
}

VisualizationEngine.prototype.clear = function( ){
    this.context.clearRect(0,0,this.width,this.height);
}


VisualizationEngine.prototype.drawLine = function( x1, y1, x2, y2 ){
    this.context.beginPath();
    this.context.moveTo( this.width-x1, this.height-y1 );
    this.context.lineTo( this.width-x2, this.height-y2 );
    this.context.stroke();
}


VisualizationEngine.prototype.drawArc = function( x, y, size, color ){
    this.context.beginPath();
    this.context.arc( this.width-x, this.height-y, size, 0, 2 * Math.PI, false);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
}

VisualizationEngine.prototype.drawArcStroked = function( x, y, size, color ){
    this.context.beginPath();
    this.context.arc( this.width-x, this.height-y, size, 0, 2 * Math.PI, false);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
}