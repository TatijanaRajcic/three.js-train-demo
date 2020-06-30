let container;
let scene;
let camera;
let renderer;
let controls;

function init() {
  container = document.querySelector("#scene-container");
  createScene();
  createCamera();
  createLights();
  createMaterials();
  createGeometries();
  createMeshes();
  createControls();
  createRenderer();
  play();
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue"); // the color of the scene (think about it as the walls)
  var axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
}

function createCamera() {
  const fov = 35;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(2.5, 5, 10); // no matter the position of the camera, it will always look at its target, which is (0,0,0) by default
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 5);

  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function createMaterials() {
  const body = new THREE.MeshStandardMaterial({
    color: 0xff3333, // red
    flatShading: true,
  });

  // just as with textures, we need to put colors into linear color space
  body.color.convertSRGBToLinear();

  const detail = new THREE.MeshStandardMaterial({
    color: 0x333333, // darkgrey
    flatShading: true,
  });

  detail.color.convertSRGBToLinear();

  return {
    body,
    detail,
  };
}

function createGeometries() {
  // all geometries have (0,0,0) has a center (of their width, height, and depth)
  const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 12);

  const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5);

  const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
  wheel.rotateX(Math.PI / 2);

  return {
    nose,
    cabin,
    chimney,
    wheel,
  };
}

function createMeshes() {
  // create a Group to hold the pieces of the train
  const train = new THREE.Group();
  scene.add(train);

  const materials = createMaterials();
  const geometries = createGeometries();

  const nose = new THREE.Mesh(geometries.nose, materials.body);
  nose.rotation.z = Math.PI / 2;
  nose.position.set(-1, 0, 0);

  const cabin = new THREE.Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 0.1, 0);

  const chimney = new THREE.Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-0.8, 1, 0);

  const smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.set(0, -0.7, 0);

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.scale.set(2, 2, 1.25);
  bigWheel.position.set(1.5, -0.3, 0);

  train.add(
    nose,
    cabin,
    chimney,
    smallWheelRear,
    smallWheelCenter,
    smallWheelFront,
    bigWheel
  );
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
}

function update() {}

function render() {
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.render(scene, camera);
}

function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

// function stop() {
//   renderer.setAnimationLoop(null);
// }

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
