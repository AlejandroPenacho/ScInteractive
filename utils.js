export function createProgram(canvas, vertexSource, fragmentSource){
    var gl = canvas.getContext("webgl");

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

    return [gl, program]

}