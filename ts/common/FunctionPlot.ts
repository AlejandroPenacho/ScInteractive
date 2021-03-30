import * as GLutils from "./WebGLUtils";

export class Function1D {

    nPoints : number;
    xValues : number[];
    yValues? : number[];
    computeYInShader : boolean;
    thickness : number = 1;

    constructor(xInitial : number, 
                xFinal : number, 
                nPoints : number, 
                yFunction? : (x : number) => number) {

        let deltaX : number = (xFinal - xInitial) / (nPoints-1);
        
        this.xValues = new Array(nPoints);

        for (let i=0; i<nPoints; i++){
            this.xValues[i] = xInitial + deltaX * i;
        }

        if (yFunction == undefined){
            this.computeYInShader = true;
        } else {
            this.computeYInShader = false;
            for (let i=0; i<nPoints; i++){
                this.yValues[i] = yFunction(this.xValues[i]);
            }
        }
    }

    draw(gl: WebGLRenderingContext){

        var nBufferPoints = 12*(this.nPoints-1);

        var glInputBufferData: number[] = new Array(nBufferPoints);

        for (let pointIndex=0; pointIndex<(this.nPoints-1); pointIndex++){
            let baseBufferIndex : number = 12 * pointIndex;

            glInputBufferData[baseBufferIndex] = this.xValues[pointIndex];
            glInputBufferData[baseBufferIndex+1] = this.yValues[pointIndex] - this.thickness/2;
            glInputBufferData[baseBufferIndex+2] = this.xValues[pointIndex+1];
            glInputBufferData[baseBufferIndex+3] = this.yValues[pointIndex+1] - this.thickness/2;
            glInputBufferData[baseBufferIndex+4] = this.xValues[pointIndex+1];
            glInputBufferData[baseBufferIndex+5] = this.yValues[pointIndex+1] + this.thickness/2;
            glInputBufferData[baseBufferIndex+6] = this.xValues[pointIndex];
            glInputBufferData[baseBufferIndex+7] = this.yValues[pointIndex] - this.thickness/2;
            glInputBufferData[baseBufferIndex+8] = this.xValues[pointIndex+1];
            glInputBufferData[baseBufferIndex+9] = this.yValues[pointIndex+1] + this.thickness/2;
            glInputBufferData[baseBufferIndex+10] = this.xValues[pointIndex];
            glInputBufferData[baseBufferIndex+11] = this.yValues[pointIndex] + this.thickness/2;
        }

        var attributeProperties : GLutils.Dictionary<GLutils.WebGLAttributeProperties> = {
            a_position : {
                type : gl.FLOAT,
                size : 2,
                normalize : false,
                stride : 0,
                offset : 0
            }
        }

        var wrappedProgram = GLutils.createProgram(gl, vertexSource, fragmentSource);

        GLutils.appendAttributeProperties(wrappedProgram, attributeProperties);

        GLutils.fillAttributeBuffers(gl, wrappedProgram, {a_position: new Float32Array(glInputBufferData)});



    }

}