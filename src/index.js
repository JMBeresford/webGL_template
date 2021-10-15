import './style.css';
import { Renderer } from './core/Renderer';
import { Cube } from './core/Cube';
import { PerspectiveCamera } from './core/Cameras';
import Stats from 'stats.js';

var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const canvas = document.querySelector('#webgl');

const renderer = new Renderer(canvas);
const camera = new PerspectiveCamera();

const cube = new Cube(0, 0, 0, 1, 1, 1);
cube.setPosition([0, 0, -1]);

const tick = () => {
  stats.begin();
  cube.rotation.elements[1] += 0.1;
  cube.rotation.elements[0] += 0.1;
  cube.recalculateMatrix();
  renderer.render(cube, camera);
  stats.end();

  requestAnimationFrame(tick);
};

tick();

console.log(cube);
