//COLORS
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
};

// THREEJS RELATED VARIABLES

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
  mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {
  // 获取窗口的高度和宽度
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // 创建场景对象
  scene = new THREE.Scene();
  // 计算宽高比
  aspectRatio = WIDTH / HEIGHT;
  // 设置视野角度
  fieldOfView = 60;
  // 设置近平面和远平面
  nearPlane = 1;
  farPlane = 10000;
  // 创建透视相机对象
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  // 添加场景的雾效果
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  // 设置相机的位置
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  // 创建WebGL渲染器对象
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  // 设置渲染器的大小和阴影映射属性
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  // 获取渲染器的容器元素并添加到页面上
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  // 监听窗口大小改变事件
  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

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


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights () {
  // 创建一个球面光源，向上发射白色光，向下发射黑色光，强度为0.9
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  // 创建一个方向光，颜色为白色，强度为0.9
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  // 设置方向光的位置
  shadowLight.position.set(150, 350, 350);
  // 设置方向光产生阴影
  shadowLight.castShadow = true;
  // 设置阴影相机的左边界
  shadowLight.shadow.camera.left = -400;
  // 设置阴影相机的右边界
  shadowLight.shadow.camera.right = 400;
  // 设置阴影相机的顶部边界
  shadowLight.shadow.camera.top = 400;
  // 设置阴影相机的底部边界
  shadowLight.shadow.camera.bottom = -400;
  // 设置阴影相机的近裁体
  shadowLight.shadow.camera.near = 1;
  // 设置阴影相机的远裁体
  shadowLight.shadow.camera.far = 1000;
  // 设置阴影贴图的尺寸
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // 将球面光源和方向光添加到场景中
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}


var AirPlane = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // // Create the cabin
  // var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
  // var matCockpit = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
  // var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  // cockpit.castShadow = true;
  // cockpit.receiveShadow = true;
  // this.mesh.add(cockpit);

  // Create Engine
  // var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
  // var matEngine = new THREE.MeshPhongMaterial({ color: Colors.white, shading: THREE.FlatShading });
  // var engine = new THREE.Mesh(geomEngine, matEngine);
  // engine.position.x = 40;
  // engine.castShadow = true;
  // engine.receiveShadow = true;
  // this.mesh.add(engine);

  // Create Tailplane

  // var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  // var matTailPlane = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
  // var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  // tailPlane.position.set(-35, 25, 0);
  // tailPlane.castShadow = true;
  // tailPlane.receiveShadow = true;
  // this.mesh.add(tailPlane);

  // Create Wing

  // var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  // var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  // var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  // sideWing.position.set(0,0,0);
  // sideWing.castShadow = true;
  // sideWing.receiveShadow = true;
  // this.mesh.add(sideWing);

  // Propeller

  // var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  // var matPropeller = new THREE.MeshPhongMaterial({ color: Colors.brown, shading: THREE.FlatShading });
  // this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  // this.propeller.castShadow = true;
  // this.propeller.receiveShadow = true;

  // // Blades

  // var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
  // var matBlade = new THREE.MeshPhongMaterial({ color: Colors.brownDark, shading: THREE.FlatShading });

  // var blade = new THREE.Mesh(geomBlade, matBlade);
  // blade.position.set(8, 0, 0);
  // blade.castShadow = true;
  // blade.receiveShadow = true;
  // this.propeller.add(blade);
  // this.propeller.position.set(50, 0, 0);
  // this.mesh.add(this.propeller);
  var geomPlate = new THREE.TorusGeometry(50, 40, 16, 100);
  var matPlate = new THREE.MeshPhongMaterial({ color: Colors.white });
  this.plate = new THREE.Mesh(geomPlate, matPlate);
  this.plate.rotation.x = Math.PI / 2;
  this.plate.scale.z = 0.5;
  // this.plate.rotateX(Math.PI / 4);
  this.plate.castShadow = true;
  this.plate.receiveShadow = true;
  this.mesh.add(this.plate);

  var geomTop = new THREE.SphereGeometry(50);
  var matTop = new THREE.MeshPhongMaterial({ color: 0x87CEFA })
  this.top = new THREE.Mesh(geomTop, matTop);
  this.top.scale.x = 0.9;
  this.top.scale.z = 0.9;
  this.top.castShadow = true;
  this.top.receiveShadow = true;

  this.mesh.add(this.top);

  var geomLight = new THREE.CircleGeometry(110, 10000);
  var matLight = new THREE.MeshPhongMaterial({ color: Colors.white, side: THREE.DoubleSide });
  this.light = new THREE.Mesh(geomLight, matLight);
  this.light.rotation.x = -Math.PI / 2;
  this.light.castShadow = true;
  this.light.receiveShadow = true;
  this.mesh.add(this.light);
};

Sky = function () {
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI * 2 / this.nClouds;
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle * i;
    var h = 750 + Math.random() * 200;
    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;
    c.mesh.position.z = -400 - Math.random() * 400;
    c.mesh.rotation.z = a + Math.PI / 2;
    var s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);
    this.mesh.add(c.mesh);
  }
}

Sea = function () {
  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    transparent: true,
    opacity: .6,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Cloud = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20, 20, 20);
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.white,
  });

  var nBlocs = 3 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nBlocs; i++) {
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;
    var s = .1 + Math.random() * .9;
    m.scale.set(s, s, s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

// 3D Models
var sea;
var airplane;

function createPlane () {
  // 创建一个飞机对象
  airplane = new AirPlane();

  // 将飞机的网格缩放设置为0.25
  airplane.mesh.scale.set(.25, .25, .25);

  // 将飞机的网格y坐标位置设置为100
  airplane.mesh.position.y = 100;

  // 将飞机的网格添加到场景中
  scene.add(airplane.mesh);
}

// 创建一个名为sea的函数
function createSea() {
  // 创建一个新的Sea对象，并将其赋值给变量sea
  sea = new Sea();
  // 将sea的mesh的position的y坐标设置为-600
  sea.mesh.position.y = -600;
  // 将sea的mesh添加到场景中
  scene.add(sea.mesh);
}

function createSky () {
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function loop () {
  // 更新飞机
  updatePlane();
  
  // 旋转海洋平面
  sea.mesh.rotation.z += .005;
  
  // 旋转天空平面
  sky.mesh.rotation.z += .01;
  
  // 渲染场景
  renderer.render(scene, camera);
  
  // 请求下一帧动画，并递归调用loop函数
  requestAnimationFrame(loop);
}

function updatePlane () {
  // 将鼠标位置归一化到指定范围
  var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
  var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
  // 更新飞机的位置
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  // 增加飞机螺旋桨的旋转角度
  // airplane.propeller.rotation.x += 0.3;
}

function normalize (v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}

function init (event) {
  // 添加mousemove事件监听器，当鼠标移动时调用handleMouseMove函数
  document.addEventListener('mousemove', handleMouseMove, false);
  
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
  
  // 进入循环更新阶段
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

// 处理鼠标移动事件
function handleMouseMove (event) {
  // 计算水平方向上的缩放比例
  var tx = -1 + (event.clientX / WIDTH) * 2;
  // 计算垂直方向上的缩放比例
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  // 设置鼠标位置对象的x和y属性为计算得到的缩放比例
  mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
