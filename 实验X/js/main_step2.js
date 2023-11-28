//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    pink:0xF5986E,
    brown:0x59332e,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN VARIABLES

var HEIGHT, WIDTH;

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
  // 设置渲染器的大小
  renderer.setSize(WIDTH, HEIGHT);
  // 开启渲染器的阴影映射功能
  renderer.shadowMap.enabled = true;
  // 获取渲染器容器元素
  container = document.getElementById('world');
  // 将容器元素添加到页面中
  container.appendChild(renderer.domElement);

  // 添加窗口调整事件监听器
  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
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

function createLights() {
  // 创建一个半球光源，颜色为0xaaaaaa，底部颜色为0x000000，强度为0.9
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

  // 创建一个环境光源，颜色为0xdc8874，强度为0.5
  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  // 创建一个定向光源，颜色为0xffffff，强度为0.9
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  // 设置定向光源的位置
  shadowLight.position.set(150, 350, 350);
  // 设置定向光源产生阴影
  shadowLight.castShadow = true;
  // 设置定向光源阴影相机的左边界
  shadowLight.shadow.camera.left = -400;
  // 设置定向光源阴影相机的右边界
  shadowLight.shadow.camera.right = 400;
  // 设置定向光源阴影相机的顶部边界
  shadowLight.shadow.camera.top = 400;
  // 设置定向光源阴影相机的底部边界
  shadowLight.shadow.camera.bottom = -400;
  // 设置定向光源阴影相机的近裁体
  shadowLight.shadow.camera.near = 1;
  // 设置定向光源阴影相机的远裁体
  shadowLight.shadow.camera.far = 1000;
  // 设置定向光源阴影贴图的宽度
  shadowLight.shadow.mapSize.width = 2048;
  // 设置定向光源阴影贴图的高度
  shadowLight.shadow.mapSize.height = 2048;

  // 将半球光源、定向光源和环境光源添加到场景中
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}


var Pilot = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "pilot";
  this.angleHairs=0;

  var bodyGeom = new THREE.BoxGeometry(15,15,15);
  var bodyMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  var body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2,-12,0);

  this.mesh.add(body);

  var faceGeom = new THREE.BoxGeometry(10,10,10);
  var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
  var face = new THREE.Mesh(faceGeom, faceMat);
  this.mesh.add(face);

  var hairGeom = new THREE.BoxGeometry(4,4,4);
  var hairMat = new THREE.MeshLambertMaterial({color:Colors.brown});
  var hair = new THREE.Mesh(hairGeom, hairMat);
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
  var hairs = new THREE.Object3D();

  this.hairsTop = new THREE.Object3D();

  for (var i=0; i<12; i++){
    var h = hair.clone();
    var col = i%3;
    var row = Math.floor(i/3);
    var startPosZ = -4;
    var startPosX = -4;
    h.position.set(startPosX + row*4, 0, startPosZ + col*4);
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  var hairSideGeom = new THREE.BoxGeometry(12,4,2);
  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
  var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  var hairSideL = hairSideR.clone();
  hairSideR.position.set(8,-2,6);
  hairSideL.position.set(8,-2,-6);
  hairs.add(hairSideR);
  hairs.add(hairSideL);

  var hairBackGeom = new THREE.BoxGeometry(2,8,10);
  var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(-1,-4,0)
  hairs.add(hairBack);
  hairs.position.set(-5,5,0);

  this.mesh.add(hairs);

  var glassGeom = new THREE.BoxGeometry(5,5,5);
  var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
  var glassR = new THREE.Mesh(glassGeom,glassMat);
  glassR.position.set(6,0,3);
  var glassL = glassR.clone();
  glassL.position.z = -glassR.position.z

  var glassAGeom = new THREE.BoxGeometry(11,1,11);
  var glassA = new THREE.Mesh(glassAGeom, glassMat);
  this.mesh.add(glassR);
  this.mesh.add(glassL);
  this.mesh.add(glassA);

  var earGeom = new THREE.BoxGeometry(2,3,2);
  var earL = new THREE.Mesh(earGeom,faceMat);
  earL.position.set(0,0,-6);
  var earR = earL.clone();
  earR.position.set(0,0,6);
  this.mesh.add(earL);
  this.mesh.add(earR);
}

Pilot.prototype.updateHairs = function(){
  var hairs = this.hairsTop.children;

  var l = hairs.length;
  for (var i=0; i<l; i++){
    var h = hairs[i];
    h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
  }
  this.angleHairs += 0.16;
}


var AirPlane = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Cockpit

  var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});

  geomCockpit.vertices[4].y-=10;
  geomCockpit.vertices[4].z+=20;
  geomCockpit.vertices[5].y-=10;
  geomCockpit.vertices[5].z-=20;
  geomCockpit.vertices[6].y+=30;
  geomCockpit.vertices[6].z+=20;
  geomCockpit.vertices[7].y+=30;
  geomCockpit.vertices[7].z-=20;

  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Engine

  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 50;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  // Tail Plane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-40,20,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

  // Wings

  var geomSideWing = new THREE.BoxGeometry(30,5,120,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,15,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  var geomWindshield = new THREE.BoxGeometry(3,15,20,1,1,1);
  var matWindshield = new THREE.MeshPhongMaterial({color:Colors.white,transparent:true, opacity:.3, shading:THREE.FlatShading});;
  var windshield = new THREE.Mesh(geomWindshield, matWindshield);
  windshield.position.set(5,27,0);

  windshield.castShadow = true;
  windshield.receiveShadow = true;

  this.mesh.add(windshield);

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  geomPropeller.vertices[4].y-=5;
  geomPropeller.vertices[4].z+=5;
  geomPropeller.vertices[5].y-=5;
  geomPropeller.vertices[5].z-=5;
  geomPropeller.vertices[6].y+=5;
  geomPropeller.vertices[6].z+=5;
  geomPropeller.vertices[7].y+=5;
  geomPropeller.vertices[7].z-=5;
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  var geomBlade = new THREE.BoxGeometry(1,80,10,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var blade1 = new THREE.Mesh(geomBlade, matBlade);
  blade1.position.set(8,0,0);

  blade1.castShadow = true;
  blade1.receiveShadow = true;

  var blade2 = blade1.clone();
  blade2.rotation.x = Math.PI/2;

  blade2.castShadow = true;
  blade2.receiveShadow = true;

  this.propeller.add(blade1);
  this.propeller.add(blade2);
  this.propeller.position.set(60,0,0);
  this.mesh.add(this.propeller);

  var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
  var wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
  wheelProtecR.position.set(25,-20,25);
  this.mesh.add(wheelProtecR);

  var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
  var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
  wheelTireR.position.set(25,-28,25);

  var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
  var wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
  wheelTireR.add(wheelAxis);

  this.mesh.add(wheelTireR);

  var wheelProtecL = wheelProtecR.clone();
  wheelProtecL.position.z = -wheelProtecR.position.z ;
  this.mesh.add(wheelProtecL);

  var wheelTireL = wheelTireR.clone();
  wheelTireL.position.z = -wheelTireR.position.z;
  this.mesh.add(wheelTireL);

  var wheelTireB = wheelTireR.clone();
  wheelTireB.scale.set(.5,.5,.5);
  wheelTireB.position.set(-35,-5,0);
  this.mesh.add(wheelTireB);

  var suspensionGeom = new THREE.BoxGeometry(4,20,4);
  suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
  var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
  suspension.position.set(-35,-5,0);
  suspension.rotation.z = -.3;
  this.mesh.add(suspension);

  this.pilot = new Pilot();
  this.pilot.mesh.position.set(-10,27,0);
  this.mesh.add(this.pilot.mesh);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

};

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sea = function(){
  var geom = new THREE.CylinderGeometry(600,600,800,40,10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  geom.mergeVertices();
  var l = geom.vertices.length;

  this.waves = [];

  for (var i=0;i<l;i++){
    var v = geom.vertices[i];
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     ang:Math.random()*Math.PI*2,
                     amp:5 + Math.random()*15,
                     speed:0.016 + Math.random()*0.032
                    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    transparent:true,
    opacity:.8,
    shading:THREE.FlatShading,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function (){
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i=0; i<l; i++){
    var v = verts[i];
    var vprops = this.waves[i];
    v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
    vprops.ang += vprops.speed;
  }
  this.mesh.geometry.verticesNeedUpdate=true;
  sea.mesh.rotation.z += .005;
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20,20,20);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

// 3D Models
var sea;
var airplane;

function createPlane(){
  // 创建一个飞机对象
  airplane = new AirPlane();
  // 将飞机的网格缩放规模设置为0.25
  airplane.mesh.scale.set(.25,.25,.25);
  // 将飞机的网格y坐标位置设置为100
  airplane.mesh.position.y = 100;
  // 将飞机的网格添加到场景中
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function loop() {
  // 更新飞机
  updatePlane();
  
  // 更新飞行员的头发
  airplane.pilot.updateHairs();
  
  // 更新相机的视野
  updateCameraFov();
  
  // 移动海浪
  sea.moveWaves();
  
  // 旋转天空的网格
  sky.mesh.rotation.z += 0.01;
  
  // 渲染场景和相机
  renderer.render(scene, camera);
  
  // 请求下一帧
  requestAnimationFrame(loop);
}

function updatePlane(){
  // 将鼠标位置的y坐标归一化到指定范围内
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  // 将鼠标位置的x坐标归一化到指定范围内
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  // 根据目标y值和当前飞机位置的y值进行差值计算，并以一定速度更新飞机位置的y坐标
  airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;
  // 根据目标y值和当前飞机位置的y值进行差值计算，并以一定速度更新飞机旋转的z角度
  airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
  // 根据当前飞机位置的y值和目标y值进行差值计算，并以一定速度更新飞机旋转的x角度
  airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;
  // 以一定速度更新飞机螺旋桨的旋转x角度
  airplane.propeller.rotation.x += 0.3;
}

// 更新相机的垂直视角
function updateCameraFov() {
  // 将鼠标位置的x坐标规范化为-1到1之间的值，然后设置为相机的垂直视角
  camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  // 初始化函数，用于注册事件监听和创建场景等操作
  document.addEventListener('mousemove', handleMouseMove, false); // 监听鼠标移动事件，并绑定到handleMouseMove函数上
  createScene(); // 创建场景
  createLights(); // 创建灯光
  createPlane(); // 创建平面
  createSea(); // 创建海洋
  createSky(); // 创建天空
  loop(); // 渲染循环
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  // 计算水平方向上的缩放比例
  var tx = -1 + (event.clientX / WIDTH) * 2;
  // 计算垂直方向上的缩放比例
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  // 创建一个包含水平和垂直缩放比例的对象
  mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
