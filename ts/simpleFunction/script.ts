import * as utils from "../common/utils";
import * as msh from "../common/mesh2D";
import * as mtx from "../common/matrix";

var canvas = document.querySelector("#gl-canvas") as HTMLCanvasElement;
var vertexShaderSource = (document.querySelector("#vertexShader") as HTMLElement).innerText;
var fragmentShaderSource = (document.querySelector("#fragmentShader") as HTMLElement).innerText;

var gl = canvas.getContext("webgl");

if (!gl){
	throw "No gl";
}

var wrappedProgram = utils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

console.log(wrappedProgram);

var attributeParameter = {
	a_position : {
		type		:	gl.FLOAT,
		size		:	3,
		normalize	:	false,
		stride		:	0,
		offset		:	0
	}
}


var myMesh = new msh.Mesh(200,200, [-5, 5], [-5, 5]);

myMesh.introduceFunction((x : number, y : number) => {return Math.sin(x + y)});

var meshData = myMesh.generateWebGLdata(true);

var attributeData = {
	a_position : new Float32Array(meshData.vertexBuffer)
};


utils.appendAttributeProperties(wrappedProgram, attributeParameter);

utils.fillAttributeBuffers(gl, wrappedProgram, attributeData);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.useProgram(wrappedProgram.program);

gl.enable(gl.DEPTH_TEST);

utils.enableAttributes(gl, wrappedProgram);


function drawAndAsk(now : number){
	let angle = now * 0.0003;
	gl.uniformMatrix4fv(wrappedProgram.uniforms.u_matrix.location, false, mtx.Matrix.perspectiveMatrix((45/180)*Math.PI, angle, 0.4).toArray());
	
	gl.drawArrays(gl.TRIANGLES, 0, meshData.nValues/3);

	requestAnimationFrame(drawAndAsk);
}

requestAnimationFrame(drawAndAsk);

