controllers.controller('homeController', ['$scope', '$rootScope', '$http', '$timeout', 'userServices',
   function($scope, $rootScope, $http, $timeout, userServices) {

      // get the canvas DOM element
      var canvas = document.getElementById("renderCanvas");


      // load 3D engine
      var engine = new BABYLON.Engine(canvas, true);


      // createScene function that creates and return the scene
      var createScene = function() {

         // create a basic BJS Scene object
         var scene = new BABYLON.Scene(engine);

         // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
         var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 10, -10), scene);

         // target the camera to scene origin
         camera.setTarget(BABYLON.Vector3.Zero());

         // attach the camera to the canvas
         camera.attachControl(canvas, false);

         // create a basic light, aiming 0,1,0 - meaning, to the sky
         var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);
         light0.diffuse = new BABYLON.Color3(1, 0, 0);
         light0.specular = new BABYLON.Color3(1, 1, 1);

         var box1 = BABYLON.Mesh.CreateBox("Box1", 3.0, scene);
         box1.position.x = -2;

         var animationBox = new BABYLON.Animation("myAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
         var animationBox2 = new BABYLON.Animation("myAnimation2", "scaling.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

         var keys = [{
            'frame': 0,
            'value': 1
         }, {
            'frame': 20,
            'value': 0.2
         }, {
            'frame': 100,
            'value': 1
         }];
         var keys2 = [{
            'frame': 0,
            'value': 1.3
         }, {
            'frame': 20,
            'value': 0.2
         }, {
            'frame': 100,
            'value': 1
         }, {
            'frame': 150,
            'value': 0.5
         }];

         animationBox.setKeys(keys);
         animationBox2.setKeys(keys2);
         box1.animations.push(animationBox);
         box1.animations.push(animationBox2);
         scene.beginAnimation(box1, 0, 100, true);

         // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
         //var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

         // return the created scene
         return scene;

      };

      // call the createScene function
      var scene = createScene();

      // run the render loop
      engine.runRenderLoop(function() {
         scene.render();
      });

      // the canvas/window resize event handler
      window.addEventListener('resize', function() {
         engine.resize();
      });

   }
]);
