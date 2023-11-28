//COLORS
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xF5986E,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,
  darkGray: 0x696969,
  lightGrey: 0xDCDCDC,
  fog: 0xB0C4DE,

};

///////////////

// GAME VARIABLES
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];
var particlesPool = [];
var particlesInUse = [];

// 重置游戏函数
function resetGame() {
  game = {
    speed: 0, // 速度
    initSpeed: 0.00035, // 初始速度
    baseSpeed: 0.00035, // 基础速度
    targetBaseSpeed: 0.00035, // 目标基础速度
    incrementSpeedByTime: 0.0000025, // 随时间增加的速度
    incrementSpeedByLevel: 0.00005, // 随关卡增加的速度
    distanceForSpeedUpdate: 100, // 更新速度的距离
    speedLastUpdate: 0, // 上一次更新速度的时间

    distance: 0, // 距离
    ratioSpeedDistance: 50, // 速度与距离的比例
    energy: 100, // 能量
    ratioSpeedEnergy: 3, // 速度与能量的比例

    level: 1, // 关卡
    levelLastUpdate: 0, // 上一次更新关卡的时间
    distanceForLevelUpdate: 1000, // 更新关卡的距离

    planeDefaultHeight: 100, // 飞机默认高度
    planeAmpHeight: 80, // 飞机高度振幅
    planeAmpWidth: 75, // 飞机宽度振幅
    planeMoveSensivity: 0.005, // 飞机移动灵敏度
    planeRotXSensivity: 0.0008, // 飞机X轴旋转灵敏度
    planeRotZSensivity: 0.0004, // 飞机Z轴旋转灵敏度
    planeFallSpeed: 0.001, // 飞机下落速度
    planeMinSpeed: 1.2, // 飞机最小速度
    planeMaxSpeed: 1.6, // 飞机最大速度
    planeSpeed: 0, // 飞机速度
    planeCollisionDisplacementX: 0, // 飞机碰撞时的水平位移
    planeCollisionSpeedX: 0, // 飞机碰撞时的水平速度

    planeCollisionDisplacementY: 0, // 飞机碰撞时的垂直位移
    planeCollisionSpeedY: 0, // 飞机碰撞时的垂直速度

    seaRadius: 600, // 海域半径
    seaLength: 800, // 海域长度
    //seaRotationSpeed:0.006,
    wavesMinAmp: 5, // 波浪最小振幅
    wavesMaxAmp: 20, // 波浪最大振幅
    wavesMinSpeed: 0.001, // 波浪最小速度
    wavesMaxSpeed: 0.003, // 波浪最大速度

    cameraFarPos: 500, // 相机远距离位置
    cameraNearPos: 150, // 相机近距离位置
    cameraSensivity: 0.002, // 相机灵敏度

    coinDistanceTolerance: 15, // 硬币出现距离容差
    coinValue: 3, // 硬币价值
    coinsSpeed: 0.5, // 硬币速度
    coinLastSpawn: 0, // 上一次生成硬币的时间
    distanceForCoinsSpawn: 100, // 硬币生成距离

    ennemyDistanceTolerance: 10, // 敌人出现距离容差
    ennemyValue: 10, // 敌人价值
    ennemiesSpeed: 0.6, // 敌人速度
    ennemyLastSpawn: 0, // 上一次生成敌人的时间
    distanceForEnnemiesSpawn: 50, // 敌人生成距离

    status: "playing", // 游戏状态
  };
  fieldLevel.innerHTML = Math.floor(game.level); // 在游戏区域显示关卡数
}

//THREEJS RELATED VARIABLES

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  renderer,
  container,
  controls;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
  mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene () {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  //创建场景
  scene = new THREE.Scene();

  //创建相机
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = .1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  //雾化
  scene.fog = new THREE.Fog(Colors.fog, 200, 950);

  //设置相机位置
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = game.planeDefaultHeight;
  //camera.lookAt(new THREE.Vector3(0, 400, 0));

  //创建渲染
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);


}

// MOUSE AND SCREEN EVENTS

function handleWindowResize () {
  // 获取窗口的高度和宽度
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // 设置渲染器的大小为窗口的高度和宽度
  renderer.setSize(WIDTH, HEIGHT);

  // 更新相机的宽高比
  camera.aspect = WIDTH / HEIGHT;

  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
}

// 处理鼠标移动事件
function handleMouseMove (event) {
  // 计算水平方向上的缩放比例
  var tx = -1 + (event.clientX / WIDTH) * 2;
  // 计算垂直方向上的缩放比例
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  // 设置鼠标位置对象的x和y属性为计算得到的缩放比例
  mousePos = { x: tx, y: ty };
}

function handleTouchMove (event) {
  event.preventDefault();
  var tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
  var ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

function handleMouseUp (event) {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}


function handleTouchEnd (event) {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights () {

  hemisphereLight = new THREE.HemisphereLight(0x7CEFA, 0xDCDCDC, .1)

  ambientLight = new THREE.AmbientLight(0xDCDCDC, .9);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);

}


var Pilot = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "pilot";
  this.angleHairs = 0;

  var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
  var bodyMat = new THREE.MeshPhongMaterial({ color: Colors.brown, shading: THREE.FlatShading });
  var body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2, -12, 0);

  this.mesh.add(body);

  var faceGeom = new THREE.BoxGeometry(10, 10, 10);
  var faceMat = new THREE.MeshLambertMaterial({ color: Colors.pink });
  var face = new THREE.Mesh(faceGeom, faceMat);
  this.mesh.add(face);

  var hairGeom = new THREE.BoxGeometry(4, 4, 4);
  var hairMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
  var hair = new THREE.Mesh(hairGeom, hairMat);
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
  var hairs = new THREE.Object3D();

  this.hairsTop = new THREE.Object3D();

  for (var i = 0; i < 12; i++) {
    var h = hair.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -4;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
  var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  var hairSideL = hairSideR.clone();
  hairSideR.position.set(8, -2, 6);
  hairSideL.position.set(8, -2, -6);
  hairs.add(hairSideR);
  hairs.add(hairSideL);

  var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
  var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(-1, -4, 0)
  hairs.add(hairBack);
  hairs.position.set(-5, 5, 0);

  this.mesh.add(hairs);

  var glassGeom = new THREE.BoxGeometry(5, 5, 5);
  var glassMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
  var glassR = new THREE.Mesh(glassGeom, glassMat);
  glassR.position.set(6, 0, 3);
  var glassL = glassR.clone();
  glassL.position.z = -glassR.position.z

  var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
  var glassA = new THREE.Mesh(glassAGeom, glassMat);
  this.mesh.add(glassR);
  this.mesh.add(glassL);
  this.mesh.add(glassA);

  var earGeom = new THREE.BoxGeometry(2, 3, 2);
  var earL = new THREE.Mesh(earGeom, faceMat);
  earL.position.set(0, 0, -6);
  var earR = earL.clone();
  earR.position.set(0, 0, 6);
  this.mesh.add(earL);
  this.mesh.add(earR);
}

Pilot.prototype.updateHairs = function () {
  //*
  var hairs = this.hairsTop.children;

  var l = hairs.length;
  for (var i = 0; i < l; i++) {
    var h = hairs[i];
    h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
  }
  this.angleHairs += game.speed * deltaTime * 40;
  //*/
}

var AirPlane = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  var geomPlate = new THREE.TorusGeometry(50, 40, 16, 100);
  var matPlate = new THREE.MeshPhongMaterial({ color: 0xC0C0C0, specular: 0xC0C0C0 });
  this.plate = new THREE.Mesh(geomPlate, matPlate);
  this.plate.rotation.x = Math.PI / 2;
  this.plate.scale.z = 0.5;
  // this.plate.rotateX(Math.PI / 4);
  this.plate.castShadow = true;
  this.plate.receiveShadow = true;
  this.mesh.add(this.plate);

  var geomTop = new THREE.SphereGeometry(50);
  var matTop = new THREE.MeshPhongMaterial({ color: Colors.blue, side: THREE.DoubleSide, specular: Colors.blue })
  this.top = new THREE.Mesh(geomTop, matTop);
  this.top.scale.x = 0.9;
  this.top.scale.z = 0.9;
  this.top.castShadow = true;
  this.top.receiveShadow = true;

  this.mesh.add(this.top);

  var geomLight = new THREE.CircleGeometry(110, 10000);
  var matLight = new THREE.MeshPhongMaterial({ color: Colors.lightGrey, side: THREE.DoubleSide, specular: Colors.lightGrey });
  // matLight.shininess = 10;
  // matLight.specular = Colors.white;
  this.light = new THREE.Mesh(geomLight, matLight);
  this.light.rotation.x = -Math.PI / 2;
  this.light.castShadow = true;
  this.light.receiveShadow = true;
  this.mesh.add(this.light);




  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

};

Sky = function () {
  this.mesh = new THREE.Object3D();
  this.nClouds = 40;
  this.clouds = [];
  var stepAngle = Math.PI * 2 / this.nClouds;
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle * i;
    var h = game.seaRadius + 150 + Math.random() * 200;
    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;
    c.mesh.position.z = -300 - Math.random() * 500;
    c.mesh.rotation.z = a + Math.PI / 2;
    var s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);
    this.mesh.add(c.mesh);
  }
}

Sky.prototype.moveClouds = function () {
  for (var i = 0; i < this.nClouds; i++) {
    var c = this.clouds[i];
    c.rotate();
  }
  this.mesh.rotation.z += game.speed * deltaTime;

}

Sea = function () {
  var geom = new THREE.CylinderGeometry(game.seaRadius, game.seaRadius, game.seaLength, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geom.mergeVertices();
  var l = geom.vertices.length;

  this.waves = [];

  for (var i = 0; i < l; i++) {
    var v = geom.vertices[i];
    //v.y = Math.random()*30;
    this.waves.push({
      y: v.y,
      x: v.x,
      z: v.z,
      ang: Math.random() * Math.PI * 2,
      amp: game.wavesMinAmp + Math.random() * (game.wavesMaxAmp - game.wavesMinAmp),
      // speed: game.wavesMinSpeed + Math.random() * (game.wavesMaxSpeed - game.wavesMinSpeed)
      speed: 0
    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.darkGray,
    transparent: true,
    opacity: .8,
    shading: THREE.FlatShading,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function () {
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i = 0; i < l; i++) {
    var v = verts[i];
    var vprops = this.waves[i];
    v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
    vprops.ang += vprops.speed * deltaTime;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}

Cloud = function () {
  //创建一个空的容器
  this.mesh = new THREE.Object3D();

  this.mesh.name = "cloud";

  //创建一个立方体
  // var geom = new THREE.CubeGeometry(20, 20, 20);
  var geom = new THREE.DodecahedronGeometry(4)

  //
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.lightGrey,

  });

  //*
  var nBlocs = 2 + Math.floor(Math.random() * 5);
  for (var i = 0; i < nBlocs; i++) {
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 100;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;
    var s = .1 + Math.random() * .9;
    m.scale.set(s, s, s);
    this.mesh.add(m);
    m.castShadow = true;
    m.receiveShadow = true;

  }
  //*/
}

Cloud.prototype.rotate = function () {
  var l = this.mesh.children.length;
  for (var i = 0; i < l; i++) {
    var m = this.mesh.children[i];
    m.rotation.z += Math.random() * .005 * (i + 1);
    m.rotation.y += Math.random() * .002 * (i + 1);
  }
}

Ennemy = function () {
  var geom = new THREE.TetrahedronGeometry(8, 2);
  var mat = new THREE.MeshLambertMaterial({

    color: Colors.darkGray,
    shininess: 0,
    specular: 0xffffff,
    shading: THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

EnnemiesHolder = function () {
  this.mesh = new THREE.Object3D();
  this.ennemiesInUse = [];
}

EnnemiesHolder.prototype.spawnEnnemies = function () {
  var nEnnemies = game.level;

  for (var i = 0; i < nEnnemies; i++) {
    var ennemy;
    if (ennemiesPool.length) {
      ennemy = ennemiesPool.pop();
    } else {
      ennemy = new Ennemy();
    }

    ennemy.angle = - (i * 0.1);
    ennemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;

    this.mesh.add(ennemy.mesh);
    this.ennemiesInUse.push(ennemy);
  }
}

EnnemiesHolder.prototype.rotateEnnemies = function () {
  for (var i = 0; i < this.ennemiesInUse.length; i++) {
    var ennemy = this.ennemiesInUse[i];
    ennemy.angle += game.speed * deltaTime * game.ennemiesSpeed;

    if (ennemy.angle > Math.PI * 2) ennemy.angle -= Math.PI * 2;

    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
    ennemy.mesh.rotation.z += Math.random() * .1;
    ennemy.mesh.rotation.y += Math.random() * .1;

    //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
    var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
    var d = diffPos.length();
    if (d < game.ennemyDistanceTolerance) {
      particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.darkGray, 3);

      ennemiesPool.unshift(this.ennemiesInUse.splice(i, 1)[0]);
      this.mesh.remove(ennemy.mesh);
      game.planeCollisionSpeedX = 100 * diffPos.x / d;
      game.planeCollisionSpeedY = 100 * diffPos.y / d;
      ambientLight.intensity = 2;

      removeEnergy();
      i--;
    } else if (ennemy.angle > Math.PI) {
      ennemiesPool.unshift(this.ennemiesInUse.splice(i, 1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }
  }
}

Particle = function () {
  var geom = new THREE.TetrahedronGeometry(3, 0);
  // var geom = new THREE.BoxGeometry(2, 2, 2)
  var mat = new THREE.MeshPhongMaterial({
    color: 0x009999,
    shininess: 0,
    specular: 0xffffff,
    shading: THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom, mat);
}

Particle.prototype.explode = function (pos, color, scale) {
  var _this = this;
  var _p = this.mesh.parent;
  this.mesh.material.color = new THREE.Color(color);
  this.mesh.material.needsUpdate = true;
  this.mesh.scale.set(scale, scale, scale);
  var targetX = pos.x + (-1 + Math.random() * 2) * 50;
  var targetY = pos.y + (-1 + Math.random() * 2) * 50;
  var speed = .6 + Math.random() * .2;
  TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * 12, y: Math.random() * 12 });
  TweenMax.to(this.mesh.scale, speed, { x: .1, y: .1, z: .1 });
  TweenMax.to(this.mesh.position, speed, {
    x: targetX, y: targetY, delay: Math.random() * .1, ease: Power2.easeOut, onComplete: function () {
      if (_p) _p.remove(_this.mesh);
      _this.mesh.scale.set(1, 1, 1);
      particlesPool.unshift(_this);
    }
  });
}

ParticlesHolder = function () {
  this.mesh = new THREE.Object3D();
  this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale) {

  var nPArticles = density;
  for (var i = 0; i < nPArticles; i++) {
    var particle;
    if (particlesPool.length) {
      particle = particlesPool.pop();
    } else {
      particle = new Particle();
    }
    this.mesh.add(particle.mesh);
    particle.mesh.visible = true;
    var _this = this;
    particle.mesh.position.y = pos.y;
    particle.mesh.position.x = pos.x;
    particle.explode(pos, color, scale);
  }
}

Coin = function () {
  // var geom = new THREE.TetrahedronGeometry(5, 0);
  var geom = new THREE.BoxGeometry(5, 5, 5)
  var mat = new THREE.MeshPhongMaterial({
    color: 0x009999,
    shininess: 0,
    specular: 0xffffff,

    shading: THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

CoinsHolder = function (nCoins) {
  this.mesh = new THREE.Object3D();
  this.coinsInUse = [];
  this.coinsPool = [];
  for (var i = 0; i < nCoins; i++) {
    var coin = new Coin();
    this.coinsPool.push(coin);
  }
}

CoinsHolder.prototype.spawnCoins = function () {

  var nCoins = 1 + Math.floor(Math.random() * 10);
  var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
  var amplitude = 10 + Math.round(Math.random() * 10);
  for (var i = 0; i < nCoins; i++) {
    var coin;
    if (this.coinsPool.length) {
      coin = this.coinsPool.pop();
    } else {
      coin = new Coin();
    }
    this.mesh.add(coin.mesh);
    this.coinsInUse.push(coin);
    coin.angle = - (i * 0.02);
    coin.distance = d + Math.cos(i * .5) * amplitude;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
  }
}

CoinsHolder.prototype.rotateCoins = function () {
  for (var i = 0; i < this.coinsInUse.length; i++) {
    var coin = this.coinsInUse[i];
    if (coin.exploding) continue;
    coin.angle += game.speed * deltaTime * game.coinsSpeed;
    if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
    coin.mesh.rotation.z += Math.random() * .1;
    coin.mesh.rotation.y += Math.random() * .1;

    //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
    var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
    var d = diffPos.length();
    if (d < game.coinDistanceTolerance) {
      this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
      this.mesh.remove(coin.mesh);
      particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
      addEnergy();
      i--;
    } else if (coin.angle > Math.PI) {
      this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
}


// 3D Models
var sea;
var airplane;

function createPlane () {
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25, .25, .25);
  airplane.mesh.position.y = game.planeDefaultHeight;
  scene.add(airplane.mesh);
}

function createSea () {
  sea = new Sea();
  sea.mesh.position.y = -game.seaRadius;
  scene.add(sea.mesh);
}

function createSky () {
  sky = new Sky();
  sky.mesh.position.y = -game.seaRadius;
  scene.add(sky.mesh);
}

function createCoins () {

  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh)
}

function createEnnemies () {
  for (var i = 0; i < 10; i++) {
    var ennemy = new Ennemy();
    ennemiesPool.push(ennemy);
  }
  ennemiesHolder = new EnnemiesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(ennemiesHolder.mesh)
}

function createParticles() {
  for (var i = 0; i < 10; i++) {
    var particle = new Particle();  // 创建一个粒子对象
    particlesPool.push(particle);  // 将粒子对象添加到粒子池中
  }
  particlesHolder = new ParticlesHolder();  // 创建一个粒子持有对象
  // ennemiesHolder.mesh.position.y = -game.seaRadius;  // 设置敌人持有对象的网格位置.y为海平面以下的半径
  scene.add(particlesHolder.mesh);  // 将粒子持有对象的网格添加到场景中
}

function loop () {
  // 获取当前时间
  newTime = new Date().getTime();
  // 计算时间差
  deltaTime = newTime - oldTime;
  // 保存当前时间
  oldTime = newTime;

  // 如果游戏状态为playing
  if (game.status == "playing") {

    // 每跑完100m就生成能量币
    if (Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn) {
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    // 每跑完100m就更新速度
    if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
    }

    // 每跑完100m就生成敌机
    if (Math.floor(game.distance) % game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn) {
      game.ennemyLastSpawn = Math.floor(game.distance);
      ennemiesHolder.spawnEnnemies();
    }

    // 每跑完100m就升级关卡
    if (Math.floor(game.distance) % game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate) {
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      fieldLevel.innerHTML = Math.floor(game.level);

      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level
    }

    // 更新飞机位置
    updatePlane();
    // 更新距离
    updateDistance();
    // 更新能量
    updateEnergy();
    // 更新基础速度
    game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    // 根据基础速度计算速度
    game.speed = game.baseSpeed * game.planeSpeed;

  } else if (game.status == "gameover") {
    // 速度逐渐减慢
    game.speed *= .99;
    // 移动飞机
    airplane.mesh.rotation.z += (-Math.PI / 2 - airplane.mesh.rotation.z) * .0002 * deltaTime;
    airplane.mesh.rotation.x += 0.0003 * deltaTime;
    // 调整飞机下落速度
    game.planeFallSpeed *= 1.05;
    airplane.mesh.position.y -= game.planeFallSpeed * deltaTime;

    // 如果飞机下落至y轴小于-200的位置，则显示重玩按钮
    if (airplane.mesh.position.y < -200) {
      showReplay();
      game.status = "waitingReplay";
    }
  } else if (game.status == "waitingReplay") {

  }


  // 移动飞机螺旋桨
  // airplane.propeller.rotation.x += .2 + game.planeSpeed * deltaTime * .005;
  // 移动海洋
  sea.mesh.rotation.z += game.speed * deltaTime;//*game.seaRotationSpeed;

  // 如果海洋旋转角度大于2π，则减去2π
  if (sea.mesh.rotation.z > 2 * Math.PI) sea.mesh.rotation.z -= 2 * Math.PI;

  // 调整环境光的强度
  ambientLight.intensity += (.5 - ambientLight.intensity) * deltaTime * 0.005;

  // 移动能量币
  coinsHolder.rotateCoins();
  // 移动敌机
  ennemiesHolder.rotateEnnemies();

  // 移动云彩
  sky.moveClouds();
  // 移动海浪
  sea.moveWaves();

  // 渲染场景
  renderer.render(scene, camera);
  // 请求下一帧
  requestAnimationFrame(loop);
}

function updateDistance () {
  // 更新游戏距离
  game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
  
  // 更新游戏距离显示
  fieldDistance.innerHTML = Math.floor(game.distance);
  
  // 更新游戏速度显示
  speed.innerHTML = Math.floor(game.speedLastUpdate / 100);
  
  // 计算当前关卡进度
  var d = 502 * (1 - (game.distance % game.distanceForLevelUpdate) / game.distanceForLevelUpdate);
  
  // 更新关卡进度显示
  levelCircle.setAttribute("stroke-dashoffset", d);
}

var blinkEnergy = false;

function updateEnergy () {
  // 更新能量
  game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  energyBar.style.right = (100 - game.energy) + "%";
  energyBar.style.backgroundColor = (game.energy < 50) ? "#f25346" : "#68c3c0";

  // 如果能量小于50，设置动画名为"blinking"，否则设置为"none"
  if (game.energy < 30) {
    energyBar.style.animationName = "blinking";
  } else {
    energyBar.style.animationName = "none";
  }

  // 如果能量小于1，游戏结束
  if (game.energy < 1) {
    game.status = "gameover";
  }
}

function addEnergy () {
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
}

function removeEnergy () {
  game.energy -= game.ennemyValue;
  game.energy = Math.max(0, game.energy);
}



// 更新飞机状态和位置的函数
function updatePlane() {

  // 将鼠标位置标准化为一个范围，并限制飞机速度在一定范围内
  game.planeSpeed = normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);

  // 根据鼠标位置确定目标的垂直方向位置
  var targetY = normalize(mousePos.y, -.75, .75, game.planeDefaultHeight - game.planeAmpHeight, game.planeDefaultHeight + game.planeAmpHeight);

  // 根据鼠标位置确定目标的水平方向位置
  var targetX = normalize(mousePos.x, -1, 1, -game.planeAmpWidth * .7, -game.planeAmpWidth);

  // 更新飞机与环境的碰撞偏移量和速度
  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  targetX += game.planeCollisionDisplacementX;

  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  targetY += game.planeCollisionDisplacementY;

  // 根据目标位置和当前位置更新飞机的位置
  airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * deltaTime * game.planeMoveSensivity;
  airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * deltaTime * game.planeMoveSensivity;

  // 根据飞机位置和目标位置更新相机的旋转角度
  airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * deltaTime * game.planeRotXSensivity;
  airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * deltaTime * game.planeRotZSensivity;

  // 根据飞机速度确定相机的目标位置
  var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);

  // 根据鼠标位置标准化相机的视场角
  camera.fov = normalize(mousePos.x, -1, 1, 40, 80);

  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();

  // 根据飞机位置和目标位置更新相机的位置
  camera.position.y += (airplane.mesh.position.y - camera.position.y) * deltaTime * game.cameraSensivity;

  // 更新飞机与环境的碰撞速度
  game.planeCollisionSpeedX += (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
  game.planeCollisionSpeedY += (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;

  // 更新飞机的飞行员状态
  // airplane.pilot.updateHairs();
}

function showReplay () {
  replayMessage.style.display = "block";
}

function hideReplay () {
  replayMessage.style.display = "none";
}

function normalize (v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

function init (event) {
  // 初始化游戏

  // 获取UI元素
  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");
  speed = document.getElementById("speedValue");

  // 重置游戏
  resetGame();
  // 创建场景
  createScene();

  // 创建灯光
  createLights();
  // 创建平面
  createPlane();
  // 创建海洋
  createSea();
  // 创建天空
  createSky();
  // 创建金币
  createCoins();
  // 创建敌舰
  createEnnemies();
  // 创建粒子效果
  createParticles();

  // 监听鼠标移动事件
  document.addEventListener('mousemove', handleMouseMove, false);
  // 监听触摸移动事件
  document.addEventListener('touchmove', handleTouchMove, false);
  // 监听鼠标抬起事件
  document.addEventListener('mouseup', handleMouseUp, false);
  // 监听触摸结束事件
  document.addEventListener('touchend', handleTouchEnd, false);

  // 进入游戏循环
  loop();
}

window.addEventListener('load', init, false);
