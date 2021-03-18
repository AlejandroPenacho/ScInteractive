import * as utils from "./utils.js"

var canvas = document.querySelector("#gl-canvas");
var vertexShaderSource = document.querySelector("#vertexShader").text;
var fragmentShaderSource = document.querySelector("#fragmentShader").text;


var gl = canvas.getContext("webgl");

var wrappedProgram = utils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

var attributeParameter = {
	a_position : {
		type		:	gl.FLOAT,
		size		:	2,
		normalize	:	false,
		stride		:	0,
		offset		:	0
	}
}

var attributeData = {
	a_position : new Float32Array([0, 0, 0.8, 0, 0, 0.3])
}


utils.appendAttributeData(wrappedProgram, attributeParameter);

utils.generateAttributeBuffers(gl, wrappedProgram);

utils.fillAttributeBuffers(gl, wrappedProgram, attributeData);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.useProgram(wrappedProgram.program);

utils.enableAttributes(gl, wrappedProgram);

gl.drawArrays(gl.TRIANGLES, 0, 3);

console.log(wrappedProgram);
