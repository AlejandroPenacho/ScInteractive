"use strict";

interface WebGLOutput {
    vertexBuffer: number[],
    nValues     : number,
    xRange      : number[],
    yRange      : number[],
    zRange      : number[]
}

export class Mesh{

    nXvalues    :   number;
    nYvalues    :   number;

    xRange      :   number[];
    yRange      :   number[];
    zRange      :   number[];

    xValues     :   number[];
    yValues     :   number[];
    zValues     :   number[][];



    constructor(nXvalues: number, nYvalues: number,
                xRange: number[], yRange: number[]){

        // Initializes a bi-dimiensional mesh with points.

        this.nXvalues = nXvalues;
        this.nYvalues = nYvalues;

        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = [0,0];

        this.xValues = new Array(nXvalues);
        this.yValues = new Array(nYvalues);
        this.zValues = new Array(nXvalues);

        let initialX = xRange[0];
        let initialY = yRange[0];
        let deltaX   = (xRange[1]-xRange[0]) / (nXvalues - 1);
        let deltaY   = (yRange[1]-yRange[0]) / (nYvalues - 1);

        for (let i = 0; i<nXvalues; i++){
            this.xValues[i] = initialX + deltaX * i;
            this.zValues[i] = new Array(nYvalues);
        }
        for (let j = 0; j<nYvalues; j++){
            this.yValues[j] = initialY + deltaY * j;
        }
    }

    introduceFunction(zFunction: Function){

        let z0: number = zFunction(this.xValues[0], this.yValues[1]);
        this.zRange = [z0, z0];

        for (let i = 0; i<this.nXvalues; i++){
            for (let j = 0; j<this.nYvalues; j++){
                this.zValues[i][j] = zFunction(this.xValues[i], this.yValues[j]);

                if (this.zValues[i][j] < this.zRange[0]){
                    this.zRange[0] = this.zValues[i][j];
                } else if (this.zValues[i][j] > this.zRange[1]) {
                    this.zRange[1] = this.zValues[i][j];
                }
            }
        }
        
    }

    generateWebGLdata( normalized : boolean = false): WebGLOutput {
        let nValues = 18 * (this.nXvalues - 1) * (this.nYvalues - 1);

        var buffer: number[] = new Array();

        for (let i = 0; i<(this.nXvalues-1); i++){
            for (let j = 0; j<(this.nYvalues-1); j++){

                let x0 : number = this.xValues[i];
                let x1 : number = this.xValues[i+1];
                let x2 : number = this.xValues[i];
                let x3 : number = this.xValues[i+1];

                let y0 : number = this.yValues[j];
                let y1 : number = this.yValues[j];
                let y2 : number = this.yValues[j+1];
                let y3 : number = this.yValues[j+1];

                let z0 : number = this.zValues[i][j];
                let z1 : number = this.zValues[i+1][j];
                let z2 : number = this.zValues[i][j+1];
                let z3 : number = this.zValues[i+1][j+1];


                let zeroIndex = (i * this.nYvalues  + j) * 18;

                buffer.push(...[x0, y0, z0, x1, y1, z1, x2, y2, z2,
                        x1, y1, z1, x3, y3, z3, x2, y2, z2]);
                
            }
        }

        if (normalized){

            let deltaX : number = 2/(this.xRange[1] - this.xRange[0]);
            let deltaY : number = 2/(this.yRange[1] - this.yRange[0]);
            let deltaZ : number = 1/(this.zRange[1] - this.zRange[0]);
            
            for (let i=0; i<nValues; i+= 3){
                buffer[i] = (buffer[i] - this.xRange[0]) * deltaX - 1; 
                buffer[i+1] = (buffer[i+1] - this.yRange[0]) * deltaY - 1; 
                buffer[i+2] = (buffer[i+2] - this.zRange[0]) * deltaZ; 
            }
        }

        return {vertexBuffer    :   buffer,
                nValues         :   nValues,
                xRange          :   this.xRange,
                yRange          :   this.yRange,
                zRange          :   this.zRange};

    } 

}