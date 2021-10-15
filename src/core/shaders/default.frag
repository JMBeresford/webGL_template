precision mediump float;

uniform vec2 uResolution;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution;

  gl_FragColor = vec4(1.0, st, 1.0);
}