import { Matrix4, Vector3 } from '../../lib/cuon-matrix-cse160';
import { Object3D } from './Object3D';

class PerspectiveCamera extends Object3D {
  constructor({ position, target, fov = 75, near = 0.01, far = 20 }) {
    super({ position });

    if (target && !target.elements) {
      console.error('Target must be of type Vector3');
      return;
    }

    this.type = 'camera';
    this.aspect = window.screen.width / window.screen.height;

    this.target = target || new Vector3([0, 0, 0]);

    this.viewMatrix = new Matrix4().setLookAt(
      ...this.position.elements,
      ...this.target.elements,
      ...this.up.elements
    );

    this.projectionMatrix = new Matrix4().setPerspective(
      fov,
      this.aspect,
      near,
      far
    );
  }
}

export { PerspectiveCamera };
