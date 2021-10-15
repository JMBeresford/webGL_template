import { Matrix4 } from '../../lib/cuon-matrix-cse160';
import { Object3D, Attribute, Uniform } from './Object3D';

let _scaleMatrix = new Matrix4();
let _rotMatrix = new Matrix4();
let _translateMatrix = new Matrix4();
let _viewMatrix = new Matrix4();

class Cube extends Object3D {
  constructor(x, y, z, width, height, depth) {
    super(x, y, z);

    this.type = 'cube';
    this.scale.elements[0] = width;
    this.scale.elements[1] = height;
    this.scale.elements[2] = depth;

    this.attributes.push(
      new Attribute(
        new Float32Array([
          // v0
          -0.5, -0.5, 0.5,
          // v1
          -0.5, 0.5, 0.5,
          // v2
          0.5, -0.5, 0.5,
          // v3
          0.5, 0.5, 0.5,
          // v4
          -0.5, -0.5, -0.5,
          // v5
          -0.5, 0.5, -0.5,
          // v6
          0.5, -0.5, -0.5,
          // v7
          0.5, 0.5, -0.5,
        ]),
        3,
        'aPosition'
      )
    );

    this.indices = new Uint8Array([
      // front
      0, 2, 1, 1, 2, 3,
      // right
      3, 2, 6, 3, 6, 7,
      // back
      5, 4, 6, 5, 6, 7,
      // left
      5, 4, 0, 5, 0, 1,
      // top
      5, 1, 3, 5, 3, 7,
      // bottom
      0, 4, 6, 0, 6, 2,
    ]);

    this.recalculateMatrix();

    this.uniforms.push(
      new Uniform(
        this.matrix.elements,
        this.matrix.elements.length,
        'modelMatrix',
        'mat4'
      )
    );
  }
}

export { Cube };
