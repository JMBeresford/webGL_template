import { Vector3 } from '../../lib/cuon-matrix-cse160';
import defaultVertexShader from './shaders/default.vert';
import defaultFragmentShader from './shaders/default.frag';
import { getWebGLContext, createProgram } from '../../lib/cuon-utils';

class Renderer {
  constructor(canvas) {
    if (canvas === null) {
      console.warn('Could not find the canvas element!');
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.gl = getWebGLContext(canvas, false, {
      powerPreference: 'high-performance',
    });

    window.addEventListener('resize', (e) => {
      this.gl.canvas.width = e.target.innerWidth;
      this.gl.canvas.height = e.target.innerHeight;

      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    });

    if (!this.gl) {
      console.warn('Could not get the webGL context!');
      return;
    }

    this.defaultProgram = createProgram(
      this.gl,
      defaultVertexShader,
      defaultFragmentShader
    );

    this.viewMatrixLocation = null;
    this.projectionMatrixLocation = null;
    this.resolutionLocation = null;

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.clear();
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  setClearColor(r, g, b, a) {
    if (typeof r === 'object') {
      this.gl.clearColor(r);
    } else {
      this.gl.clearColor(r, g, b, a);
    }
  }

  render(scene, camera) {
    this.clear();

    scene.traverse((obj) => {
      if (obj.autoUpdateMatrix) {
        obj.recalculateMatrix();
      }

      if (obj.visible === false) {
        return;
      }

      if (obj.program !== null) {
        this.gl.useProgram(obj.program);
        this.gl.program = obj.program;
      } else {
        this.gl.useProgram(this.defaultProgram);
        this.gl.program = this.defaultProgram;
      }

      obj.uniforms.viewMatrix.value.set(camera.viewMatrix.elements);
      obj.uniforms.projectionMatrix.value.set(camera.projectionMatrix.elements);
      obj.uniforms.uResolution.value.set([
        this.gl.canvas.width,
        this.gl.canvas.height,
      ]);

      let drawMode = this.gl.DYNAMIC_DRAW;
      let drawType = this.gl.TRIANGLES;

      switch (obj.drawMode) {
        case 'static': {
          drawMode = this.gl.STATIC_DRAW;
          break;
        }
        case 'stream': {
          drawMode = this.gl.STREAM_DRAW;
          break;
        }
        default: {
          drawMode = this.gl.DYNAMIC_DRAW;
          break;
        }
      }

      switch (obj.drawType) {
        case 'triangles': {
          drawType = this.gl.TRIANGLES;
          break;
        }
        case 'triangle_fan': {
          drawType = this.gl.TRIANGLE_FAN;
          break;
        }
        case 'triangle_strip': {
          drawType = this.gl.TRIANGLE_STRIP;
          break;
        }
        case 'lines': {
          drawType = this.gl.LINES;
          break;
        }
        case 'lines_strip': {
          drawType = this.gl.LINE_STRIP;
          break;
        }
        case 'lines_loop': {
          drawType = this.gl.LINE_LOOP;
          break;
        }
        default: {
          drawType = this.gl.POINTS;
          break;
        }
      }

      for (let attribute of obj.attributes) {
        let created = false;
        if (attribute.buffer === null) {
          attribute.buffer = this.gl.createBuffer();
          created = true;
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
        }

        this.gl.bufferData(this.gl.ARRAY_BUFFER, attribute.value, drawMode);

        if (attribute.location === null) {
          attribute.location = this.gl.getAttribLocation(
            this.gl.program,
            attribute.name
          );
        }

        const attribPtr = attribute.location;

        if (attribPtr === -1) {
          continue;
        }

        if (created) {
          this.gl.vertexAttribPointer(
            attribPtr,
            attribute.countPerVertex,
            this.gl.FLOAT,
            false,
            0,
            0
          );
          this.gl.enableVertexAttribArray(attribPtr);
        }
      }

      const uniforms = obj.uniforms;
      for (let name in uniforms) {
        if (uniforms[name].location === null) {
          uniforms[name].location = this.gl.getUniformLocation(
            this.gl.program,
            name
          );
        }

        let uniformPtr = uniforms[name].location;

        switch (uniforms[name].type) {
          case 'vec1': {
            this.gl.uniform1f(uniformPtr, ...uniforms[name].value);
            break;
          }
          case 'vec2': {
            this.gl.uniform2f(uniformPtr, ...uniforms[name].value);
            break;
          }
          case 'vec3': {
            this.gl.uniform3f(uniformPtr, ...uniforms[name].value);
            break;
          }
          case 'vec4': {
            this.gl.uniform4f(uniformPtr, ...uniforms[name].value);
            break;
          }

          case 'mat3': {
            this.gl.uniformMatrix3fv(uniformPtr, false, uniforms[name].value);
            break;
          }
          case 'mat4': {
            this.gl.uniformMatrix4fv(uniformPtr, false, uniforms[name].value);
            break;
          }
        }
      }

      if (obj.indexBuffer === null) {
        obj.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
      }

      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, obj.indices, drawMode);

      this.gl.drawElements(
        drawType,
        obj.indices.length,
        this.gl.UNSIGNED_BYTE,
        0
      );
    });
  }
}

export { Renderer };
