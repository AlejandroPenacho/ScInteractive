export function createProgram(gl, vertexSource, fragmentSource){

    var shaders = [
        gl.createShader(gl.VERTEX_SHADER),
        gl.createShader(gl.FRAGMENT_SHADER)
    ];

    var shaderNames = ["vertex", "fragment"];
    var shaderSources = [vertexSource, fragmentSource];

    var program = gl.createProgram();

    for (let i=0; i<2; i++){
        gl.shaderSource(shaders[i], shaderSources[i]);
        gl.compileShader(shaders[i]);
        if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS)){
            console.log("Error compiling " + shaderNames[i] + " shader");
        }
        gl.attachShader(program, shaders[i]);
    }

    
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log("Error linking program");
    }


	let nActiveAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	let nActiveUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

	var activeAttributes = {};
	for (let i=0; i<nActiveAttributes; i++) {
		let currentAttribute = gl.getActiveAttrib(program, i);
		activeAttributes[currentAttribute.name] = {id : currentAttribute};
	}

	var activeUniforms = {};
	for (let i=0; i<nActiveUniforms; i++) {
		let currentUniform = gl.getActiveUniform(program, i);
		activeUniforms[currentUniform.name] = {id : currentUniform};
	}

    return {
		program		:	program,
		attributes	:	activeAttributes,
		uniforms	:	activeUniforms
	}

}

export function appendAttributeData(wrappedProgram, attributeData){

	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i = 0; i < attributeList.length; i++) {
		let key = attributeList[i];

		wrappedProgram.attributes[key].type			=	attributeData[key].type;
		wrappedProgram.attributes[key].size			=	attributeData[key].size;
		wrappedProgram.attributes[key].normalize	=	attributeData[key].normalize;
		wrappedProgram.attributes[key].stride		=	attributeData[key].stride;
		wrappedProgram.attributes[key].offset		=	attributeData[key].offset;
	}
	
}

export function generateAttributeBuffers(gl, wrappedProgram) {
	
	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i=0; i<attributeList.length; i++) {
		var attribute = wrappedProgram.attributes[attributeList[i]];
		var newBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
		attribute.buffer = newBuffer;
	}
}


export function fillAttributeBuffers(gl, wrappedProgram, attributeData){

	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i=0; i<attributeList.length; i++) {
		let attribute = wrappedProgram.attributes[attributeList[i]];
		gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
		gl.bufferData(gl.ARRAY_BUFFER,  attributeData[attributeList[i]], gl.STATIC_DRAW);
	}
}

export function enableAttributes(gl, wrappedProgram){
	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i=0; i<attributeList.length; i++) {
		let attribute = wrappedProgram.attributes[attributeList[i]];

		gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
		gl.enableVertexAttribArray(attribute.id);
		gl.vertexAttribPointer(	
			attribute.id,
			attribute.size,
			attribute.type,
			attribute.normalize,
			attribute.stride,
			attribute.offset);
	}
}


