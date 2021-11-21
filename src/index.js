import './style.css';
import { Renderer } from './core/Renderer';
import { Cube } from './core/primitives/Cube';
import { Plane } from './core/primitives/Plane';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import { PointerLockControls } from './core/utils/PointerLockControls';
import { Matrix4 } from '../lib/cuon-matrix-cse160';
import { Sphere } from './core/primitives/Sphere';
import { AmbientLight } from './core/lights/AmbientLight';
import { PointLight } from './core/lights/PointLight';
import { SpotLight } from './core/lights/SpotLight';

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);

// camera
const camera = new PerspectiveCamera([0, 0.5, 6]);

// lights
const ambientLight = new AmbientLight([0.3, 0.3, 0.3], 0.2);
const pointLight = new PointLight([0, 2, 3], [1, 0, 0], 0.7);
pointLight.visible = true;
const spotLight = new SpotLight([0, 2, -3], [0, 0, 0]);
spotLight.visible = true;
spotLight.setColor(0, 0, 1);

// scene
const scene = new Scene();

// default cube ;)
const cube = new Cube([-2, 0, 0]);

const sphere = new Sphere(1, 20, 20, [2, 0, 0]);

// floor
const floor = new Plane(25, 25);

floor.setPosition(0, -3, 0);
floor.setRotation(-90, 0, 0);
floor.setColor(0.3, 0.3, 0.3);

scene.add([cube, sphere, floor, ambientLight, pointLight, spotLight]);

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
      x: -2,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    color: {
      r: 255,
      g: 255,
      b: 255,
    },
    autoRotate: true,
  },
  sphere: {
    position: {
      x: 2,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    color: {
      r: 255,
      g: 255,
      b: 255,
    },
  },
  ambientLight: {
    color: {
      r: 0.3 * 255,
      g: 0.3 * 255,
      b: 0.3 * 255,
    },
    intensity: 0.2,
  },
  pointLight: {
    color: {
      r: 255,
      g: 0,
      b: 0,
    },
    position: {
      x: 0,
      y: 2,
      z: 3,
    },
    intensity: 0.7,
  },
  spotLight: {
    color: {
      r: 0,
      g: 0,
      b: 255,
    },
    position: {
      x: 0,
      y: 2,
      z: -3,
    },
    target: {
      x: 0,
      y: 0,
      z: 0,
    },
    angle: 15,
    intensity: 0.7,
  },
};

const scenef = pane.addFolder({ title: 'Scene', expanded: false });
const cubef = pane.addFolder({ title: 'Cube', expanded: false });
const spheref = pane.addFolder({ title: 'Sphere', expanded: false });
const alightf = pane.addFolder({ title: 'Ambient Light', expanded: false });
const plightf = pane.addFolder({ title: 'Point Light', expanded: false });
const slightf = pane.addFolder({ title: 'Spot Light', expanded: false });

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

cubef.addInput(PARAMS.cube, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  cube.setColor(r / 255, g / 255, b / 255);
});

cubef.addInput(PARAMS.cube, 'autoRotate').on('change', (e) => {
  PARAMS.cube.autoRotate = e.value;
});

spheref.addInput(PARAMS.sphere, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  sphere.setPosition(x, y, z);
});

spheref.addInput(PARAMS.sphere, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  sphere.setRotation(x, y, z);
});

spheref.addInput(PARAMS.sphere, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  sphere.setColor(r / 255, g / 255, b / 255);
});

alightf.addInput(PARAMS.ambientLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  ambientLight.setColor(r / 255, g / 255, b / 255);
});

alightf
  .addInput(PARAMS.ambientLight, 'intensity', { step: 0.1 })
  .on('change', (e) => {
    let i = e.value;

    ambientLight.intensity = i;
  });

plightf.addInput(PARAMS.pointLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  pointLight.setColor(r / 255, g / 255, b / 255);
});

plightf.addInput(PARAMS.pointLight, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  pointLight.setPosition(x, y, z);
});

plightf
  .addInput(PARAMS.pointLight, 'intensity', { step: 0.1 })
  .on('change', (e) => {
    let i = e.value;

    pointLight.intensity = i;
  });

slightf.addInput(PARAMS.spotLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  spotLight.setColor(r / 255, g / 255, b / 255);
});

slightf.addInput(PARAMS.spotLight, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  spotLight.setPosition(x, y, z);
});

slightf.addInput(PARAMS.spotLight, 'target').on('change', (e) => {
  let { x, y, z } = e.value;

  spotLight.target = [x, y, z];
});

slightf
  .addInput(PARAMS.spotLight, 'intensity', { step: 0.1 })
  .on('change', (e) => {
    let i = e.value;

    spotLight.intensity = i;
  });

slightf.addInput(PARAMS.spotLight, 'angle', { step: 1 }).on('change', (e) => {
  let i = e.value;

  spotLight.cutoffAngle = i;
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
