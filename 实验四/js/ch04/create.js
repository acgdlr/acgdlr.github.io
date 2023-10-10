var s;
var sc;
var sb;
var sci;
var traingles = [];
var fTraingles = [];
var cubes = [];
var boxs = [];
var circles = [];
var indexCircles = [];
var fCircles = [];
var max1 = 2.0;
var min1 = 0.5;
var kk = 1;
var f = 1;
var speed = 85;
var speed2 = 95;
var lgh = 45;
function getTraingle(x,y) {

	x -= 500;
	x /= 500;
	x *= 110;
	y = 256 - y;
	y /= 256;
	y *= 55;
	console.log(y);


	
// 创建聚光灯
var spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(130, 130, -130);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 4;
spotLight.shadow.penumbra = 0.05
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.innerHeight = 1024;
// 添加聚光灯

scene.add(spotLight)




	var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
	var p1 = new THREE.Vector3(x-5, y-4.6, 0); //顶点1坐标
	var p2 = new THREE.Vector3(x+5, y-4.6, 0); //顶点2坐标
	var p3 = new THREE.Vector3(x, y+4.05, 0); //顶点3坐标
	

	//添加立方体
var boxGeometry = new THREE.BoxGeometry(4, 4, 4);

var cubeMaterial = new THREE.MeshLambertMaterial({
color: 0xff0000
})




	//顶点坐标添加到geometry对象
	geometry.vertices.push(p1, p2, p3);
	//材质对象
	var material = new THREE.MeshPhongMaterial({
		color:0xff0000,
		specular:0xff0000,
		shininess:12
	});

	           
				var triangles = 160000;
			
				
				var geometry = new THREE.BufferGeometry();
				
				var positions = new Float32Array(triangles * 3 * 3);
				var normals = new Float32Array(triangles * 3 * 3);
				var colors = new Float32Array(triangles * 3 * 3);
				
				var color = new THREE.Color();
				
			
				var n = 800, n2 = n/2;
				
				var d = 12, d2 = d/2;
				
				
				var pA = new THREE.Vector3();
				var pB = new THREE.Vector3();
				var pC = new THREE.Vector3();
				
				var cb = new THREE.Vector3();
				var ab = new THREE.Vector3();
				
			
				for(var i = 0; i < positions.length; i += 9){
					
					var x = Math.random() * n - n2;
					var y = Math.random() * n - n2; 
					var z = Math.random() * n - n2; 
					
				
					var ax = x + Math.random() * d - d2;
					var ay = y + Math.random() * d - d2;
					var az = z + Math.random() * d - d2;
					
					var bx = x + Math.random() * d - d2;
					var by = y + Math.random() * d - d2;
					var bz = z + Math.random() * d - d2;
					
					var cx = x + Math.random() * d - d2;
					var cy = y + Math.random() * d - d2;
					var cz = z + Math.random() * d - d2;
					
					// 小三角形点a坐标占 index 0-2
					positions[i] = ax;
					positions[i+1] = ay;
					positions[i+2] = az;
					// 小三角形点b坐标占 index 3-5
					positions[i+3] = bx;
					positions[i+4] = by;
					positions[i+5] = bz;
					// 小三角形点c坐标占 index 6-8
					positions[i+6] = cx;
					positions[i+7] = cy;
					positions[i+8] = cz;
					// 设置三角形的三个顶点
					pA.set(ax, ay, az);
					pB.set(bx, by, bz);
					pC.set(cx, cy, cz);
					// pC pB向量相减（三角形一条边）
					cb.subVectors(pC, pB);
					// A B向量相减（三角形一条边）
					ab.subVectors(pA, pB);
					// cb ab 向量积, 即同时垂直上面两条边的向量，即法向量
					cb.cross(ab);
					// 将法向量转为单位向量
					cb.normalize();
					//法向量的方向可以这样表示N(nx, ny, nz);
					var nx = cb.x;
					var ny = cb.y;
					var nz = cb.z;
					
					// 0-8 循环法向量 xyz
					normals[i]     = nx;
					normals[i+1] = ny;
					normals[i+2] = nz;
					
					normals[i+3] = nx;
					normals[i+4] = ny;
					normals[i+5] = nz;
					
					normals[i+6] = nx;
					normals[i+7] = ny;
					normals[i+8] = nz;
	 
					
					var vx = (x/n) + 0.5;
					var vy = (y/n) + 0.5;
					var vz = (z/n) + 0.5;
			
					color.setRGB(vx, vy, vz);
	 
					colors[i] = color.r;
					colors[i+1] = color.g;
					colors[i+2] = color.b;
				
					colors[i+3] = color.r;
					colors[i+4] = color.g;
					colors[i+5] = color.b;
					
					colors[i+6] = color.r;
					colors[i+7] = color.g;
					colors[i+8] = color.b;
				}
				
				// 设置原点, 三角形, 颜色
				geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
				geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
				geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
				
				// 计算外边界球
				geometry.computeBoundingSphere();
				
				// 创建立方体材质
				var material = new THREE.MeshPhongMaterial({
					color : 0xaaaaaa, 
					ambient : 0xaaaaaa, 
					specular : 0xffffff, 
					shininess : 250,
					side : THREE.DoubleSide, 
					vertexColors : THREE.VertexColors
				});
				
				// 创建立方体物体并添加到场景
				mesh = new THREE.Mesh(geometry, material);
				scene.add(mesh);
				
	var mesh = new THREE.Mesh(geometry, material)
	// 点渲染模式
	var material = new THREE.PointsMaterial({
		color:0xff0000,
		size: 0.1 //点对象像素尺寸
	}); //材质对象
	var points = new THREE.Points(geometry, material); //点模型对象
	scene.add(points); //点对象添加到场景中
	scene.add(mesh);
	traingles.push(mesh);
	fTraingles.push(1);
	clearInterval(s);
	s = setInterval(changeTraingle,200);
}
function changeTraingle() {
	for(var i = 0;i < traingles.length; i++) {
		var k =  fTraingles[i];
		if(k > max1) f = -1;
		else if(k <= min1) f = 1;
		k += f * 0.01;
		traingles[i].scale.set(k,k,0); 
		fTraingles[i] = k;
	}
}
function getCube(x,y) {
	x -= 500;
	x /= 500;
	x *= 110;
	y = 256 - y;
	y /= 256;
	y *= 55;
	console.log(y);
	var geometry = new THREE.PlaneGeometry( 12, 12 );
	const material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
	const plane = new THREE.Mesh( geometry, material );
	plane.position.x = x;
	plane.position.y = y;
	scene.add( plane );
	cubes.push(plane);
	plane.scale.set(kk,kk,0); 
	clearInterval(sc);
	sc = setInterval(changeCubes,speed);
}
function changeCubes() {
	for(var i = 0;i < cubes.length; i++) {
		cubes[i].rotateZ(Math.PI/120);
	}
}

function getBox(x,y) {
	x -= 500;
	x /= 500;
	x *= 110;
	y = 256 - y;
	y /= 256;
	y *= 55;
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	var material = new THREE.MeshPhongMaterial({
		color:0x778899,
		specular:0x4488ee,
		shininess:12
	});
	var plane = new THREE.Mesh( geometry, material );
	plane.position.x = x;
	plane.position.y = y;
	scene.add( plane );
	boxs.push(plane);
	clearInterval(sb);
	sb = setInterval(changeBoxs,100);
}

function changeBoxs() {
	for(var i = 0;i < boxs.length; i++) {
		boxs[i].rotateX(Math.PI/8);
		boxs[i].rotateY(Math.PI/8);
	}
}

function getCircle(x,y) {
	x -= 500;
	x /= 500;
	x *= 110;
	y = 256 - y;
	y /= 256;
	y *= 55;
	const geometry = new THREE.CircleGeometry( 8, 32 );
	var material = new THREE.MeshPhongMaterial({
		color:0xff0000,
		specular:0x4488ee,
		shininess:12
	});
	const circle = new THREE.Mesh( geometry, material );
	circle.position.x = x;
	circle.position.y = y;
	scene.add( circle );
	circles.push(circle);
	fCircles.push(1);
	indexCircles.push(x);
	clearInterval(sci);
	sci = setInterval(changeCircles,speed2);
}

function changeCircles() {
	if(lgh == 0) return ;
	for(var i = 0;i < circles.length; i++) {
		var f = fCircles[i];
		if(circles[i].position.x > indexCircles[i]) f = 1;
		if(indexCircles[i] - circles[i].position.x > lgh) f = -1;
		circles[i].position.x = circles[i].position.x - f * 1;
		fCircles[i] = f;
	}
	
}


function clearAll() {
	clearInterval(s);
	clearInterval(sc);
	clearInterval(sb);
	clearInterval(sci);
	for(var i = 0;i < traingles.length; i++) scene.remove(traingles[i]);	
	for(var i = 0;i < cubes.length; i++) scene.remove(cubes[i]);	
	for(var i = 0;i < boxs.length; i++) scene.remove(boxs[i]);	
	for(var i = 0;i < circles.length; i++) scene.remove(circles[i]);	
	cubes = [];
	boxs = [];
	circles = [];
	indexCircles = [];
	fCircles = [];
	traingles = [];
	fTraingles = [];
}