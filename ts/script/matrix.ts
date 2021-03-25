
enum InitialMatrixType {
    Empty   = "empty",
    Zero    = "zero",
    Identity= "identity",
    Rotation= "rotation"
}

enum RotationAxis {
    X = 1,
    Y = 2,
    Z = 3
}


export class Matrix {

    nRows : number;
    nCols : number;
    value: number[][];

    constructor(nRows : number, nCols?: number,
                type: InitialMatrixType = InitialMatrixType.Identity,
                rotationAxis? : RotationAxis, angle? : number){

        if (type === InitialMatrixType.Rotation) {
            if (nCols && nRows!=nCols){
                throw "A rotation matrix must be square";
            } else if (rotationAxis === undefined && nRows === 4){
                throw "For 4-dim matrices, an axis must be specified";
            } else if (nRows != 3 && nRows != 4){
                throw "Rotation matrix only available for 2D and 3D";
            } else if (angle === undefined){
                throw "For rotation matrix, an angle is required";
            }
        }

        this.nRows = nRows;

        if (nCols){
            this.nCols = nCols;
        } else {
            this.nCols = nRows;
        }

        if (type === InitialMatrixType.Empty){
            return this;
        }
        
        this.value = new Array(this.nRows);


        if (type != InitialMatrixType.Rotation){
            for (let i=0; i<this.nRows; i++){
                this.value[i] = new Array(this.nCols);

                for (let j=0; j<this.nCols; j++){
                    if (type===InitialMatrixType.Identity && i===j){
                        this.value[i][j] = 1;
                    } else {
                        this.value[i][j] = 0;
                    }
                }
            }
        } else {
            switch (nRows) {
                case 3:
                    this.value = [
                        [Math.cos(angle),    -Math.sin(angle),  0],
                        [Math.sin(angle),     Math.cos(angle),  0],
                        [0,                   0,                1]
                    ];
                
                case 4:
                    switch (rotationAxis){

                        case RotationAxis.X:
                            this.value = [
                                [1,                 0,                  0,                  0],
                                [0,                 Math.cos(angle),    -Math.sin(angle),   0],
                                [0,                 Math.sin(angle),    Math.cos(angle),    0],
                                [0,                 0,                  0,                  1]
                            ];
                            break;

                        case RotationAxis.Y:
                            this.value = [
                                [Math.cos(angle),   0,                  Math.sin(angle),    0],
                                [0,                 1,                  0,                  0],
                                [-Math.sin(angle),  0,                  Math.cos(angle),    0],
                                [0,                 0,                  0,                  1]
                            ];
                            break;
            

                        case RotationAxis.Z:
                            this.value = [
                                [Math.cos(angle),   -Math.sin(angle),   0,                  0],
                                [Math.sin(angle),   Math.cos(angle),    0,                  0],
                                [0,                 0,                  1,                  0],
                                [0,                 0,                  0,                  1]
                            ];
                            break;
                    }
            }
                
        }

    }

    display() {
        console.log(this.value);
    }

    isSquare() : boolean {
        return (this.nRows == this.nCols)
    }

    static multiply(A: Matrix, B: Matrix) : Matrix {
        
        if (A.nCols != B.nRows){
            throw "Illegal matrix multiplication";
        }

        let lineLength : number = A.nCols;

        var C : Matrix = new Matrix(A.nRows, B.nCols, InitialMatrixType.Zero);

        for (let i=0; i<C.nRows; i++){
            for (let j=0; j<C.nCols; j++){
                for (let k=0; k<lineLength; k++){
                   C.value[i][j] += A.value[i][k] * B.value[k][j];
                }
            }
        }
        return C;
    }

    rotate(rotationAxis: RotationAxis, angle: number){
        if (!this.isSquare()){
            throw "Matrix is not square";
        }

        let dim = this.nRows;

        var C : Matrix = Matrix.multiply(
            new Matrix(dim,dim, InitialMatrixType.Rotation, rotationAxis, angle),
            this);
        this.value = C.value;
    }

    scale(rate : number) {
        for (let i=0; i<(this.nRows-1); i++){
            for (let j=0; j<(this.nCols-1); j++){
                this.value[i][j] *= rate;
            }
        }
    }

    static perspectiveMatrix(angleToVertical: number, zAngle: number, scale : number) : Matrix {

        console.log(angleToVertical);
        var A : Matrix = new Matrix(4,4, InitialMatrixType.Rotation, RotationAxis.X, -angleToVertical);

        A.rotate(RotationAxis.Z, -zAngle);
        A.scale(scale);
        
        return A
    }

    toArray() : number[] {
        var out = [];
        for (let i=0; i<this.nRows; i++){
            out.push(...this.value[i]);
        }

        return out;
    }
}