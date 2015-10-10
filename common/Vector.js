
function Vector( x, y ){
    this.x = x;
    this.y = y;
}

Vector.prototype.copy = function( vector ){
    return new Vector( this.x, this.y );
}

Vector.prototype.normal = function( vector ){
    return new Vector( -this.y, this.x );
}

Vector.prototype.dot = function( vector ){
    return this.x * vector.x + this.y * vector.y;
}

Vector.prototype.iadd = function( vector ){
    this.x += vector.x;
    this.y += vector.y;
    
    return this;
}

Vector.prototype.isubtract = function( vector ){
    if (typeof vector === "number" ){
        this.x -= vector;
        this.y -= vector;
    }
    else{
        this.x -= vector.x;
        this.y -= vector.y;
    }
    return this;
}

Vector.prototype.imultiply = function( vector ){
    if (typeof vector === "number" ){
        this.x *= vector;
        this.y *= vector;
    }
    else{
        this.x *= vector.x;
        this.y *= vector.y;
    }
    return this;
}

Vector.prototype.idivide = function( vector ){
    if (typeof vector === "number" ){
        if (vector != 0){
            this.x *= vector;
            this.y *= vector;
        }
        else{
            this.x = 0;
            this.y = 0;
        }
    }
    else{
        var x = (this.x != 0 ) ? (1.0 * this.x) / vector.x : 0.0;
        var y = (this.y != 0 ) ? (1.0 * this.y) / vector.y : 0.0;
        
        this.x *= x;
        this.y *= y;
    }
    return this;
}

Vector.prototype.add = function( vector ){
    return new Vector( this.x + vector.x, this.y + vector.y );
}

Vector.prototype.subtract = function( vector ){
    if (typeof vector === "number" )
        return new Vector( this.x - vector, this.y - vector );
    else
        return new Vector( this.x - vector.x, this.y - vector.y );
}

Vector.prototype.multiply = function( vector ){
    if (typeof vector === "number" )
        return new Vector( this.x * vector, this.y * vector );
    else
        return new Vector( this.x * vector.x, this.y * vector.y );
}

Vector.prototype.divide = function( vector ){
    if (typeof vector === "number" ){
        if (vector === 0)
            return new Vector( 0, 0 );
        else
            return new Vector( (1.0 * this.x) / vector, (1.0 * this.y) / vector );
    }
    else{
        var x = (this.x != 0 ) ? (1.0 * this.x) / vector.x : 0.0;
        var y = (this.y != 0 ) ? (1.0 * this.y) / vector.y : 0.0;
        return new Vector( x, y );
    }
}

Vector.prototype.modulo = function( mx, my ){
    return new Vector( this.x % mx, this.y%my );
}

Vector.prototype.length = function( vector ){
    return Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
}

Vector.prototype.absolute = function( vector ){
    return new Vector( Math.abs(this.x), Math.abs(this.y) );
}

Vector.prototype.toArray = function(vector){
    return [this.x, this.y]
}

Vector.prototype.toString = function( ){
    return "(x: {0}, y: {1})".format( this.x, this.y );
}

Vector.prototype.logscaled = function( vector ){
    var x = this.x;
    var scaledX = Math.pow(0.99, Math.abs(x));
    var y = this.y;
    var scaledY = Math.pow(0.99, Math.abs(y));
    
    var scaled = new Vector( scaledX, scaledY ).imultiply( this );
    return scaled;
}