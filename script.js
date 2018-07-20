const VertexCoordinates = [
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
];

const vertCode = `
attribute vec4 aVertexPosition;

void main() {
    gl_Position = aVertexPosition;
}
`;

const fragCode = `
void main() {
    gl_FragColor = vec4(0.2, 0.1, 0.5, 1.0);
}
`;

class Drawing {
  constructor(options) {
    this.canvas = options.canvas;
    this.gl = options.gl;
  }

  initBuffer(data) {
      const buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      return buffer;
  }

  compileShader(shader, src) {
      this.gl.shaderSource(shader, src);
      this.gl.compileShader(shader);
  }

  makeProgram(src) {
    const vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.compileShader(vshader, vertCode);
    this.compileShader(fshader, fragCode);

    const program = this.gl.createProgram();

    this.gl.attachShader(program, vshader);
    this.gl.attachShader(program, fshader);

    this.gl.linkProgram(program);

    return program;
  }

  drawTriangle() {
      const vertexBuffer = this.initBuffer(VertexCoordinates);
      const program = this.makeProgram();

      const num = 3;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.enableVertexAttribArray(this.gl.getAttribLocation(program, 'aVertexPosition'));
      this.gl.vertexAttribPointer(this.gl.getAttribLocation(program, 'aVertexPosition'), num, type, normalize, stride, offset);

      this.gl.clearColor(0.75, 0.75, 0.75, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.useProgram(program);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

function createGl() {
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext('webgl');
    if (gl === null) {
        alert("Your browser does not support WebGL.");
        return;
    }
    const drawing = new Drawing({
        canvas: canvas,
        gl: gl
    });

    drawing.drawTriangle();
}

createGl();
