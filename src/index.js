import './style.css';
import { Renderer } from './core/Renderer';
import { Cube } from './core/primitives/Cube';
import { Plane } from './core/primitives/Plane';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import { PointerLockControls } from './core/utils/PointerLockControls';
import basicVertexShader from './core/shaders/basic/basic.vert';
import basicFragmentShader from './core/shaders/basic/basic.frag';
import normalVertexShader from './core/shaders/normal/normal.vert';
import normalFragmentShader from './core/shaders/normal/normal.frag';
import { Matrix4 } from '../lib/cuon-matrix-cse160';
import { Sphere } from './core/primitives/Sphere';

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);

// camera
const camera = new PerspectiveCamera([0, 0.5, 3]);

// scene
const scene = new Scene();

// default cube ;)
const cube = new Cube();
const sphere = new Sphere(1, 20, 20);

// floor
const floor = new Plane(25, 25);

floor.setPosition(0, -3, 0);
floor.setRotation(90, 0, 0);
sphere.vertexShader = normalVertexShader;
sphere.fragmentShader = normalFragmentShader;
floor.vertexShader = basicVertexShader;
floor.fragmentShader = basicFragmentShader;

floor.setColor(0.75, 0.75, 0.9);

scene.add([sphere, floor]);
console.log(sphere);

// DEBUG TOOLS
const monitor = new Monitor(0);
const pane = new Pane({ title: 'Config' });

const PARAMS = {
  scene: {
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  cube: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    autoRotate: true,
  },
};

const scenef = pane.addFolder({ title: 'Scene' });
const cubef = pane.addFolder({ title: 'Cube' });

scenef.addInput(PARAMS.scene, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  scene.setRotation(x, y, z);
});

cubef.addInput(PARAMS.cube, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  cube.setPosition(x, y, z);
});

cubef.addInput(PARAMS.cube, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  cube.setRotation(x, y, z);
});

cubef.addInput(PARAMS.cube, 'autoRotate').on('change', (e) => {
  PARAMS.cube.autoRotate = e.value;
});

const controls = new PointerLockControls(camera, renderer.gl.canvas);

const tick = () => {
  monitor.begin();
  if (PARAMS.cube.autoRotate) {
    let [x, y, z] = cube.getRotation();
    cube.setRotation(x + 0.1, y + 0.1, z);
  }

  controls.update();
  renderer.render(scene, camera);
  monitor.end();

  requestAnimationFrame(tick);
};

tick();

let temp = new Matrix4().setLookAt(0, 0, 2, 0, 0, 0, 0, 1, 0);

console.log(temp);
