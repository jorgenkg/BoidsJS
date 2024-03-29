# BoidsJS

> A JavaScript simulation of boids as described by Craig Reynold. Visit this page to [see the magic](http://jorgenkg.github.io/BoidsJS/).

The boids are only being presented with local knowledge of the flock. We are able to observe the effect of gaining closer-to-global knowlegde by manipulating the neighborhood radius value in the GUI.

#### The boids are governed by three simple rules: 

1. Cohesion, the boids try sticking to the flock
2. Avoidance, the boids try not to collide with objects and other birds
3. Alignment, the boids try to align their direction of movement

#### Implementation

* Implemented using vectors, thanks to [victor.js](http://victorjs.org)
* Fast retrieval of neighboring boids by using an R-Tree, thanks to [RBush](https://github.com/mourner/rbush)
* GUI created with jQuery Mobile and KnockoutJS
* Rendered using Canvas and WebGL

#### Features

* The boids have a clever object avoidance rule to adjust their course to facilitate a smooth avoidance trajectory.
* Includes both objects to avoid and predators trying to hunt down the boids. The predator is flying slightly faster than the boids to make things more exciting.
* The GUI lets you to dynamically change the weighting scheme of the different rules to enable some experimentation.
* Super efficient neighbor retrieval using a R-Tree
* Written in HTML5 and JS and compatible with all newer browsers
