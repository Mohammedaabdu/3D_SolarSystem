import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  mercuryMeasurments,
  venusMeasurments,
  earthMeasurments,
  marsMeasurments,
  jupiterMeasurments,
  saturnMeasurments,
  uranusMeasurments,
  neptuneMeasurments,
  SunMeasurments as sunMeasurments,
} from "./planetMeasurments.js";

let scene,
  camera,
  canvas,
  renderer,
  controls,
  gui,
  textureLoader,
  raycaster,
  mouse,
  clickedPlanet,
  // bloomComposer,
  // finalComposer,
  followMode = false,
  planetMeshes = [];
let sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  jupiter,
  saturnGroup,
  uranus,
  neptune;
let clock = new THREE.Clock();
const defaultCameraPosition = new THREE.Vector3(0, 1000, 1000);
const starsCount = 100000;

init();

function init() {
  // Texture Loader
  textureLoader = new THREE.TextureLoader();

  // GUI
  gui = new GUI();

  // Scene
  const starsTexture = textureLoader.load("./Stars/2k_stars_milky_way.jpg");
  starsTexture.mapping = THREE.EquirectangularReflectionMapping;
  starsTexture.colorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  scene.background = starsTexture;

  // Canvas
  canvas = document.querySelector("canvas.webgl");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  renderer.setSize(window.innerWidth, window.innerHeight);
  createSolarSystem();

  {
    const color = 0xf3ffc7;
    const light = new THREE.AmbientLight(color, 0.2);
    const pointLight = new THREE.PointLight(color, 500000);
    scene.add(pointLight);
    scene.add(light);
  }

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  camera.position.copy(defaultCameraPosition);

  //Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener("touchstart", onClick);
  window.addEventListener("click", onClick);

  // #region //Bloom composer

  // const params = {
  //   threshold: 0,
  //   strength: 1,
  //   radius: 0.5,
  //   exposure: 1,
  // };

  // const renderScene = new RenderPass(scene, camera);
  // const bloomPass = new UnrealBloomPass(
  //   new THREE.Vector2(window.innerWidth, window.innerHeight),
  //   params.strength, // strength
  //   params.radius, // radius
  //   params.threshold // threshold
  // );

  // bloomComposer = new EffectComposer(renderer);
  // bloomComposer.addPass(renderScene);
  // bloomComposer.addPass(bloomPass);

  // const bloomFolder = gui.addFolder("BloomPass");
  // bloomFolder.add(params, "threshold", 0.0, 1.0).onChange(function (value) {
  //   bloomPass.threshold = Number(value);
  // });

  // bloomFolder.add(params, "strength", 0.0, 3).onChange(function (value) {
  //   bloomPass.strength = Number(value);
  // });

  // bloomFolder
  //   .add(params, "radius", 0.0, 1.0)
  //   .step(0.01)
  //   .onChange(function (value) {
  //     bloomPass.radius = Number(value);
  //   });

  // // Final composer
  // finalComposer = new EffectComposer(renderer);
  // finalComposer.addPass(renderScene);
  //#endregion
  renderer.setAnimationLoop(animate);
}

function onClick(event) {
  mouse.set(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planetMeshes);

  if (intersects.length > 0) {
    clickedPlanet = intersects[0].object;
    followMode = !followMode;

    if (!followMode) {
      gsap.to(camera.position, {
        duration: 2,
        x: defaultCameraPosition.x,
        y: defaultCameraPosition.y,
        z: defaultCameraPosition.z,
        onUpdate: () => controls.update(),
      });
      controls.target.copy(sun.position);
    }
  }
}

function createSolarSystem() {
  createSun();
  earth = createPlanet(earthMeasurments);
  planetMeshes.push(earth);
  mercury = createPlanet(mercuryMeasurments);
  planetMeshes.push(mercury);
  venus = createPlanet(venusMeasurments);
  planetMeshes.push(venus);
  mars = createPlanet(marsMeasurments);
  planetMeshes.push(mars);
  jupiter = createPlanet(jupiterMeasurments);
  planetMeshes.push(jupiter);
  saturnGroup = createPlanet(saturnMeasurments);
  planetMeshes.push(saturnGroup);
  uranus = createPlanet(uranusMeasurments);
  planetMeshes.push(uranus);
  neptune = createPlanet(neptuneMeasurments);
  planetMeshes.push(neptune);
  createStars();
}

function createPlanetOrbitRing(innerRadius, outerRadius, thetaSegments, color) {
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments
  );
  const material = new THREE.MeshBasicMaterial({
    color: color || 0xffffff,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starsCount * 3);
  const colors = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10000;
    colors[i] = Math.random();
  }

  const starsTexture = textureLoader.load("./Stars/star_04.png");
  const particlesMaterial = new THREE.PointsMaterial({
    size: 20,
    sizeAttenuation: true,
    color: 0xffffff,
    alphaMap: starsTexture,
    transparent: true,
  });

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(starsGeometry, particlesMaterial);
  particlesMaterial.vertexColors = true;
  particlesMaterial.depthTest = true;
  scene.add(particles);
}

function createPlanet(options) {
  const {
    name,
    texturePath,
    orbitDuration,
    rotationDuration,
    orbitRadius,
    radius,
    moonMeasurments,
    orbitColor,
    planetRing,
  } = options;

  const planet = createPlanetMesh({
    texturePath,
    radius,
    orbitDuration,
    rotationDuration,
    orbitRadius,
  });

  // Skapa orbit-ring
  createPlanetOrbitRing(orbitRadius, orbitRadius + 1, 100, orbitColor);

  if (moonMeasurments) {
    // Skapa måne
    moon = createPlanetMesh(moonMeasurments);
    planetMeshes.push(moon);
    scene.add(moon);
  }

  if (planetRing) {
    const group = new THREE.Group();
    const ring = createPlanetRing(planetRing);
    group.add(ring);
    group.add(planet);
    scene.add(group);
    return group;
  }

  scene.add(planet);

  return planet;
}

function createPlanetMesh(options) {
  const { texturePath, radius, orbitDuration, rotationDuration, orbitRadius } =
    options;
  // Ladda textur
  const texture = textureLoader.load(texturePath);

  // Skapa planet
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1,
    metalness: 0.1,
  });
  const planetMesh = new THREE.Mesh(geometry, material);
  // Slumpmässig startvinkel
  planetMesh.startAngle = Math.random() * Math.PI * 2;
  planetMesh.radius = radius;
  planetMesh.orbitRadius = orbitRadius;
  planetMesh.orbitDuration = orbitDuration;
  planetMesh.rotationDuration = rotationDuration;
  return planetMesh;
}

function createSun() {
  const sunTexture = textureLoader.load(sunMeasurments.texturePath);

  const sunGeometry = new THREE.SphereGeometry(sunMeasurments.radius, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });

  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.radius = sunMeasurments.radius;

  scene.add(sun);
  planetMeshes.push(sun);
}

function createPlanetRing(options) {
  const { ringTexturePath, radiusInner, radiusOuter } = options;

  const planetRingTexture = textureLoader.load(ringTexturePath);
  const planetRingGeometry = new THREE.RingGeometry(
    radiusInner,
    radiusOuter,
    32
  );
  const planetMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    map: planetRingTexture,
  });
  const planetRing = new THREE.Mesh(planetRingGeometry, planetMaterial);
  planetRing.rotation.x = -Math.PI / 2;
  return planetRing;
}

function resizeRendererToDisplaySize(renderer) {
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function animatePlanet(planet, elapsed) {
  let angle;
  if (planet.isGroup) {
    planet.children[1].rotation.y =
      ((2 * Math.PI) / planet.children[1].rotationDuration) * elapsed;
    angle =
      planet.children[1].startAngle +
      (elapsed / planet.children[1].orbitDuration) * 2 * Math.PI;

    planet.position.x = planet.children[1].orbitRadius * Math.cos(angle);
    planet.position.z = planet.children[1].orbitRadius * Math.sin(angle);
  } else {
    planet.rotation.y = ((2 * Math.PI) / planet.rotationDuration) * elapsed;
    angle = planet.startAngle + (elapsed / planet.orbitDuration) * 2 * Math.PI;

    planet.position.x = planet.orbitRadius * Math.cos(angle);
    planet.position.z = planet.orbitRadius * Math.sin(angle);
  }
}

function animate() {
  let delta = clock.getDelta();
  let elapsed = clock.getElapsedTime(); // total time
  sun.rotation.y = ((2 * Math.PI) / sunMeasurments.rotationDuration) * elapsed;
  animatePlanet(earth, elapsed);
  animatePlanet(moon, elapsed);
  animatePlanet(mercury, elapsed);
  animatePlanet(venus, elapsed);
  animatePlanet(mars, elapsed);
  animatePlanet(jupiter, elapsed);
  animatePlanet(saturnGroup, elapsed);
  animatePlanet(uranus, elapsed);
  animatePlanet(neptune, elapsed);

  if (clickedPlanet) {
    if (followMode) {
      const offset = new THREE.Vector3(
        clickedPlanet.radius + 20,
        clickedPlanet.radius + 20,
        clickedPlanet.radius + 20
      );

      const targetPos = clickedPlanet.position.clone().add(offset);

      gsap.to(camera.position, {
        duration: 2,
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        onUpdate: () => controls.update(),
      });

      controls.target.copy(clickedPlanet.position);
    }
  }
  if (controls) controls.update(delta);

  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
}
