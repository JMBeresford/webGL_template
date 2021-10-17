import { Object3D } from './Object3D';

class Scene extends Object3D {
  constructor({ position, scale, rotation }) {
    super({ position, scale, rotation });

    this.type = 'scene';
  }
}

export { Scene };
