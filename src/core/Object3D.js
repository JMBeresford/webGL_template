import { Vector3, Matrix4 } from '../../lib/cuon-matrix-cse160';
import defaultVertexShader from './shaders/default.vert';
import defaultFragmentShader from './shaders/default.frag';

let _scaleMatrix = new Matrix4();
let _rotMatrix = new Matrix4();
let _translateMatrix = new Matrix4();
let _viewMatrix = new Matrix4();

class Attribute {
  constructor(array, count, name) {
    if (Array.isArray(array)) {
      this.value = new Float32Array(array);
    } else {
      this.value = array;
    }

    this.countPerVertex = count;
    this.name = name;
  }
}

class Uniform {
  constructor(array, count, name, type) {
    if (Array.isArray(array)) {
      this.value = new Float32Array(array);
    } else {
      this.value = array;
    }

    this.count = count;
    this.name = name;
    this.type = type;
  }
}

class Object3D {
  constructor(x, y, z) {
    this.type = 'Object3D';

    // transforms
    this.position = new Vector3([x, y, z]);
    this.scale = new Vector3([1, 1, 1]);
    this.rotation = new Vector3([0, 0, 0]);

    // scene graph related
    this.parent = null;
    this.children = [];

    // object data
    this.matrix = new Matrix4().setIdentity();
    this.up = new Vector3([0, 1, 0]);
    this.drawMode = 'static';
    this.drawType = 'triangles';
    this.attributes = [
      // new Attribute([0, 0, 0], 3, aPosition), ex: a single vertex
    ];
    this.uniforms = [
      // new Uniform([1,0,0], 3, uColor, 'vec3'), ex: the color red as uniform
    ];
    this.indices = []; // indices of vertices to draw triangles from, in order

    this.shaders = {
      vertex: defaultVertexShader,
      fragment: defaultFragmentShader,
    };
  }

  add(child) {
    this.children.push(child);

    child.parent = this;
  }

  remove(child) {
    let idx = this.children.indexOf(child);

    child.parent = null;
    this.children.splice(idx, 1);
  }

  setPosition(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.position.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.position.set(x);
    } else {
      this.position.elements[0] = x;
      this.position.elements[1] = y;
      this.position.elements[2] = z;
    }

    this.recalculateMatrix();
  }

  setScale(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.scale.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.scale.set(x);
    } else {
      this.scale.elements[0] = x;
      this.scale.elements[1] = y;
      this.scale.elements[2] = z;
    }

    this.recalculateMatrix();
  }

  setRotation(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.rotation.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.rotation.set(x);
    } else {
      this.rotation.elements[0] = x;
      this.rotation.elements[1] = y;
      this.rotation.elements[2] = z;
    }

    this.recalculateMatrix();
  }

  setUpDirection(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.up.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.up.set(x);
    } else {
      this.up.elements[0] = x;
      this.up.elements[1] = y;
      this.up.elements[2] = z;
    }
  }

  traverse(callback) {
    callback(this);

    for (let child of this.children) {
      child.traverse(callback);
    }
  }

  recalculateMatrix() {
    _scaleMatrix.setScale(...this.scale.elements);
    _rotMatrix.setRotate(this.rotation.elements[0], 1, 0, 0);
    _rotMatrix.rotate(this.rotation.elements[1], 0, 1, 0);
    _rotMatrix.rotate(this.rotation.elements[2], 0, 0, 1);
    _translateMatrix.setTranslate(...this.position.elements);

    this.matrix.set(
      _translateMatrix.multiply(_rotMatrix).multiply(_scaleMatrix)
    );

    let u = this.uniforms.find((u) => u.name === 'modelMatrix');

    if (u) {
      u.value = this.matrix.elements;
    }
  }
}

export { Object3D, Attribute, Uniform };
