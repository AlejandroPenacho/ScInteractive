import * as utils from "./utils.js";
import * as mtx from "./matrix.js";
var canvas = document.querySelector("#gl-canvas");
var vertexShaderSource = document.querySelector("#vertexShader").innerText;
var fragmentShaderSource = document.querySelector("#fragmentShader").innerText;
var gl = canvas.getContext("webgl");
if (!gl) {
    throw "No gl";
}
var wrappedProgram = utils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
console.log(wrappedProgram);
var attributeParameter = {
    a_position: {
        type: gl.FLOAT,
        size: 3,
        normalize: false,
        stride: 0,
        offset: 0
    }
};
var myMesh = new mtx.Mesh(20, 20, [-5, 5], [-5, 5]);
myMesh.introduceFunction(function (x, y) { return Math.sin(x + y); });
var meshData = myMesh.generateWebGLdata(true);
var attributeData = {
    a_position: new Float32Array(meshData.vertexBuffer)
};
utils.appendAttributeProperties(wrappedProgram, attributeParameter);
utils.generateAttributeBuffers(gl, wrappedProgram);
utils.fillAttributeBuffers(gl, wrappedProgram, attributeData);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.useProgram(wrappedProgram.program);
gl.enable(gl.DEPTH_TEST);
gl.uniformMatrix3fv(wrappedProgram.uniforms.u_matrix.location, false, [
    0.6, 0, 0,
    0, 0.6, 0,
    0, 0, 0
]);
utils.enableAttributes(gl, wrappedProgram);
gl.drawArrays(gl.TRIANGLES, 0, meshData.nValues / 3);
