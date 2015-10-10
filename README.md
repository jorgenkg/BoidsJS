# BoidsJS

> A JavaScript simulation of boids as described by Craig Reynold. Visit this page to [see the magic](http://jorgenkg.github.io/BoidsJS/).

##### The boids are governed by three simple rules: 

1. Cohesion, the boids try sticking to the flock
2. Avoidance, the boids try not to collide with objects and other birds
3. Alignment, the boids try to align their direction of movement

##### Implementation

* Implemented using vectors, thanks to [victor.js](http://victorjs.org)
* Fast retrieval of neighboring boids by using an R-Tree, thanks to [RBush](https://github.com/mourner/rbush)
* GUI created with jQuery Mobile and KnockoutJS
* Rendered using Canvas and WebGL
