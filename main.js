import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( {color: 0xECEFF4} );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xECEFF4)
pointLight.position.set(30,30,30)
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper);

const ambientLight = new THREE.AmbientLight(0x4C566A)
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


const redLight = new THREE.PointLight(0xBF616A)
const greenLight = new THREE.PointLight(0xA3BE8C)
const blueLight = new THREE.PointLight(0x81A1C1)

redLight.position.set(0,20,20)
greenLight.position.set(20,0,20)
blueLight.position.set(20,20,0)

scene.add(redLight);
scene.add(greenLight);
scene.add(blueLight);

const redHelper = new THREE.PointLightHelper(redLight)
const greenHelper = new THREE.PointLightHelper(greenLight)
const blueHelper = new THREE.PointLightHelper(blueLight)

scene.add(redHelper);
scene.add(greenHelper);
scene.add(blueHelper);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xECEFF4 });
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture;

// Avatar
const jeffTexture = new THREE.TextureLoader().load('logo_1080x1080.png')

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: jeffTexture })
);

scene.add(jeff)

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

moon.position.setX(-20)
scene.add(moon)


// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
// https://stackoverflow.com/questions/42812861/three-js-pivot-point/42866733#42866733
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.001;

  controls.update();

  rotateAboutPoint(redLight, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 0.01, true);
  rotateAboutPoint(greenLight, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0.02, true);
  rotateAboutPoint(blueLight, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), 0.03, true);
  rotateAboutPoint(pointLight, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 0.05, true);

  renderer.render( scene, camera );
}

animate()
