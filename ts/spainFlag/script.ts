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


var image = new Image();
image.src = "../../public/spain_flag/spain.jpg";
image.onload = function() {
	imageLoaded();
}

function imageLoaded(){

	var texture: WebGLTexture = gl.createTexture();
	const textureIndex : number = 4;

	gl.activeTexture(gl.TEXTURE0 + textureIndex);
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	gl.uniform1i(wrappedProgram.uniforms.u_image.location, textureIndex);

	gl.uniform3fv(wrappedProgram.uniforms.u_lightRay.location, [0, 0, -1]);

	function drawAndAsk(now : number){

		let angle = now * 0.0003;

		gl.uniformMatrix4fv(wrappedProgram.uniforms.u_matrix.location, false, mtx.Matrix.perspectiveMatrix((210/180)*Math.PI, 0, 0.4).toArray());
		gl.uniform1f(wrappedProgram.uniforms.u_time.location, now);

		
		gl.drawArrays(gl.TRIANGLES, 0, meshData.nValues/3);
	
		requestAnimationFrame(drawAndAsk);
	}
	
	requestAnimationFrame(drawAndAsk);
}



