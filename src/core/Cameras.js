import { Matrix4 } from '../../lib/cuon-matrix-cse160';
import { Object3D } from './Object3D';

class PerspectiveCamera extends Object3D {
  constructor(position, target, fov = 75, near = 0.01, far = 20) {
    super();

    this.type = 'camera';
    this.aspect = window.screen.width / window.screen.height;

    let pos, tar;

    if (!position) {
      pos = [0, 0, -3];
    } else if (position.elements) {
      pos = position.elements;
    } else if (Array.isArray(position)) {
      pos = position;
    }

    if (!target) {
      tar = [0, 0, 0];
    } else if (target.elements) {
      tar = target.elements;
    } else if (Array.isArray(target)) {
      tar = target;
    }

    this.viewMatrix = new Matrix4().setLookAt(
      ...pos,
      ...tar,
      ...this.up.elements
    );

    this.projectionMatrix = new Matrix4().setPerspective(
      fov,
      this.aspect,
      near,
      far
    );

    console.log(this);
  }
}

export { PerspectiveCamera };
