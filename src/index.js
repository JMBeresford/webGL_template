import './style.css';
import { Renderer } from './core/Renderer';
import { Cube } from './core/Cube';
import { PerspectiveCamera } from './core/Cameras';
import { Monitor } from './core/debug/stats';

const monitor = new Monitor(0);
const canvas = document.querySelector('#webgl');

const renderer = new Renderer(canvas);
const camera = new PerspectiveCamera({ position: [0, 0, -3] });

const cube = new Cube({ position: [0, 0, 0], scale: [1, 1, 1] });
cube.setPosition([0, 0, -1]);

const tick = () => {
  monitor.begin();
  cube.rotation.elements[1] += 0.1;
  cube.rotation.elements[0] += 0.1;
  cube.recalculateMatrix();
  renderer.render(cube, camera);
  monitor.end();

  requestAnimationFrame(tick);
};

tick();
