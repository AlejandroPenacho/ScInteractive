import * as utils from "./utils.js"

var canvas = document.querySelector("#gl-canvas");
var vertexShaderSource = document.querySelector("#vertexShader").text;
var fragmentShaderSource = document.querySelector("#fragmentShader").text;


var output = utils.createProgram(canvas, vertexShaderSource, fragmentShaderSource);

var gl = output[0];
var program = output[1];

var a_position = gl.getAttribLocation(program, "a_position");

var positionData = [
    0,      0,
    0.8,    0,
    0,      0.3
]

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.useProgram(program);

gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 3);