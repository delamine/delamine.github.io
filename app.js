// This is just playing with the tutorial from the lovely Spite:
// http://www.clicktorelease.com/blog/how-to-make-clouds-with-css-3d

(function(){
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelRequestAnimationFrame = window[vendors[x]+'cancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}())

/*
  Defining our variables
  world and viewport are DOM elements,
  worldXAngle and worldYAngle are floats that hold the world rotations,
  d is an int that defines the distance of the world from the camera
*/
var world = document.getElementById('world'),
    viewport = document.getElementById('viewport'),
    worldXAngle = 0,
    worldYAngle = 0,
    d = 0;

/*
  objects is an array of clouds bases
  layers is an array of clouds layers
*/
var objects = [],
    layers = [];

generate();

/*
  Creates a single cloud base: a div in world
  that is translated randomly into world space.
  Each axis goes from -256 to 256 pixels.
*/
function createCloud() {
  var div = document.createElement('div');
  div.className = 'cloudBase';
  var random_x = 256 - (Math.random() * 512);
  var random_y = 256 - (Math.random() * 512);
  var random_z = 256 - (Math.random() * 512);
  var t = 'translateX(' + random_x + 'px) \
           translateY(' + random_y + 'px) \
           translateZ(' + random_z + 'px)';
  div.style.transform = t;
  world.appendChild(div);
  
  for (var j = 0; j < 5 + Math.round(Math.random() * 10); j++) {
    // var cloud = document.createElement('div');
    var cloud = document.createElement('img');
    
    // http://pngimg.com/upload/cloud_PNG28.png
    cloud.src = 'http://www.clicktorelease.com/code/css3dclouds/cloud.png';
    cloud.className = 'cloudLayer';
    cloud.style.opacity = .8;
    var random_x = 256 - (Math.random() * 512);
    var random_y = 256 - (Math.random() * 512);
    var random_z = 100 - (Math.random() * 200);
    var random_a = Math.random() * 360;
    var random_s = .25 + Math.random();
    random_x *= .2;
    random_y *= .2;
    cloud.data = {
      x: random_x,
      y: random_y,
      z: random_z,
      a: random_a,
      s: random_s,
      speed: .1 * Math.random()
    };
    var t = 'translateX(' + random_x + 'px) \
             translateY(' + random_y + 'px) \
             translateZ(' + random_z + 'px) \
             rotateZ(' + random_a + 'deg) \
             scale(' + random_s + ')';
    cloud.style.transform = t;
    div.appendChild(cloud);
    layers.push(cloud);
  }
  
  return div;
}

/*
  Event listener to transform mouse position into angles
  from -180 to 180 degrees, both vertically and horizontally
*/
window.addEventListener('mousemove', function(e) {
  worldYAngle = -(.5 - (e.clientX/window.innerWidth)) * 180;
  worldXAngle = -(.5 - (e.clientY/window.innerHeight)) * 180;
  updateView();
});

window.addEventListener('mousewheel', onContainerMouseWheel);
window.addEventListener('DOMMouseScroll', onContainerMouseWheel);


/*
  Clears the DOM of previous clouds bases
  and generates a new set of cloud bases
*/
function generate() {
  objects = [];
  if (world.hasChildNodes()) {
    while (world.childNodes.length >= 1) {
      world.removeChild(world.firstChild);
    }
  }
  for (var j = 0; j < 5; j++) {
    objects.push(createCloud());
  }
}

/*
  Changes the transform property of world to be
  translated in the Z axis by d pixels,
  rotated in the X axis by worldXAngle degrees and
  rotated in the Y axis by worldYAngle degrees.
*/
function updateView() {
  world.style.transform = 'translateZ(' + d + 'px) \
    rotateX(' + worldXAngle + 'deg) \
    rotateY(' + worldYAngle + 'deg)';
}

function onContainerMouseWheel(event) {
  event = event ? event : window.event;
  d = d - (event.detail ? event.detail * -5 : event.wheelDelta / 8);
  updateView();
}

function update() {
  for (var j = 0; j < layers.length; j++) {
    var layer = layers[j];
    layer.data.a += layer.data.speed;
    var t = 'translateX( ' + layer.data.x + 'px ) \
             translateY( ' + layer.data.y + 'px ) \
             translateZ( ' + layer.data.z + 'px ) \
             rotateY( ' + ( - worldYAngle ) + 'deg ) \
             rotateX( ' + ( - worldXAngle ) + 'deg ) \
             rotateZ( ' + layer.data.a + 'deg ) \
             scale( ' + layer.data.s + ')';
    layer.style.transform = t;
    // layer.style.filter = 'blur(5px)';
  }
  requestAnimationFrame(update);
}

update();
