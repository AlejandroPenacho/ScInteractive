export function createProgram(gl, vertexSource, fragmentSource){
	// Takes a context, a string with the code for the vertex shader and
	// for the fragment shader. Compiles both codes and links them, generating
	// a wrapped program that includes the final program and dictionaries with
	// the attributes and uniforms of the program.

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
	// To each attribute in the wrapped program, includes the parameters
	// of each one, as described in attributeData. THis is a dictionary
	// which, for each attribute, includes:
	//
	//		type	:	type of the data (for example, gl.FLOAT)
	//		size	:	number of elements taken per iteration
	//		stride	:	the stride (you know what that means)
	//		offset	:	offset of the attribute
	//
	// These parameters are not required until the attributes
	// are enabled and configured.

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
	// Generates a buffer for each attribute, and appends it
	// to its dictionary inside wrappedProgram. Does not take
	// any additional input, and does not require anything.
	
	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i=0; i<attributeList.length; i++) {
		var attribute = wrappedProgram.attributes[attributeList[i]];
		var newBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
		attribute.buffer = newBuffer;
	}
}


export function fillAttributeBuffers(gl, wrappedProgram, attributeData){
	// Writed the data in attributeData to the buffers of each attribute.
	// attributeData is a dictionary, taking the attributes as keys, and
	// the data as values. It must be in the correct format (generated
	// with new float32Array, for example). The buffers must have been
	// previously generated (with "generateAttributeBuffers()"). This
	// can be the last step before drawing.

	var attributeList = Object.keys(wrappedProgram.attributes);

	for (let i=0; i<attributeList.length; i++) {
		let attribute = wrappedProgram.attributes[attributeList[i]];
		gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
		gl.bufferData(gl.ARRAY_BUFFER,  attributeData[attributeList[i]], gl.STATIC_DRAW);
	}
}

export function enableAttributes(gl, wrappedProgram){
	// Enable and configure the pointer of all attributes in the program.
	// Requires the attribute data to have been appended (with 
	// "appendAttributeData()") and the buffers to have been generated (with 
	// "generateAttributeBuffers()").


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


