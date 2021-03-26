var InitialMatrixType;
(function (InitialMatrixType) {
    InitialMatrixType["Empty"] = "empty";
    InitialMatrixType["Zero"] = "zero";
    InitialMatrixType["Identity"] = "identity";
    InitialMatrixType["Rotation"] = "rotation";
})(InitialMatrixType || (InitialMatrixType = {}));
var RotationAxis;
(function (RotationAxis) {
    RotationAxis[RotationAxis["X"] = 1] = "X";
    RotationAxis[RotationAxis["Y"] = 2] = "Y";
    RotationAxis[RotationAxis["Z"] = 3] = "Z";
})(RotationAxis || (RotationAxis = {}));
var Matrix = /** @class */ (function () {
    function Matrix(nRows, nCols, type, rotationAxis, angle) {
        if (type === void 0) { type = InitialMatrixType.Identity; }
        if (type === InitialMatrixType.Rotation) {
            if (nCols && nRows != nCols) {
                throw "A rotation matrix must be square";
            }
            else if (rotationAxis === undefined && nRows === 4) {
                throw "For 4-dim matrices, an axis must be specified";
            }
            else if (nRows != 3 && nRows != 4) {
                throw "Rotation matrix only available for 2D and 3D";
            }
            else if (angle === undefined) {
                throw "For rotation matrix, an angle is required";
            }
        }
        this.nRows = nRows;
        if (nCols) {
            this.nCols = nCols;
        }
        else {
            this.nCols = nRows;
        }
        if (type === InitialMatrixType.Empty) {
            return this;
        }
        this.value = new Array(this.nRows);
        if (type != InitialMatrixType.Rotation) {
            for (var i = 0; i < this.nRows; i++) {
                this.value[i] = new Array(this.nCols);
                for (var j = 0; j < this.nCols; j++) {
                    if (type === InitialMatrixType.Identity && i === j) {
                        this.value[i][j] = 1;
                    }
                    else {
                        this.value[i][j] = 0;
                    }
                }
            }
        }
        else {
            switch (nRows) {
                case 3:
                    this.value = [
                        [Math.cos(angle), -Math.sin(angle), 0],
                        [Math.sin(angle), Math.cos(angle), 0],
                        [0, 0, 1]
                    ];
                case 4:
                    switch (rotationAxis) {
                        case RotationAxis.X:
                            this.value = [
                                [1, 0, 0, 0],
                                [0, Math.cos(angle), -Math.sin(angle), 0],
                                [0, Math.sin(angle), Math.cos(angle), 0],
                                [0, 0, 0, 1]
                            ];
                            break;
                        case RotationAxis.Y:
                            this.value = [
                                [Math.cos(angle), 0, Math.sin(angle), 0],
                                [0, 1, 0, 0],
                                [-Math.sin(angle), 0, Math.cos(angle), 0],
                                [0, 0, 0, 1]
                            ];
                            break;
                        case RotationAxis.Z:
                            this.value = [
                                [Math.cos(angle), -Math.sin(angle), 0, 0],
                                [Math.sin(angle), Math.cos(angle), 0, 0],
                                [0, 0, 1, 0],
                                [0, 0, 0, 1]
                            ];
                            break;
                    }
            }
        }
    }
    Matrix.prototype.display = function () {
        console.log(this.value);
    };
    Matrix.prototype.isSquare = function () {
        return (this.nRows == this.nCols);
    };
    Matrix.multiply = function (A, B) {
        if (A.nCols != B.nRows) {
            throw "Illegal matrix multiplication";
        }
        var lineLength = A.nCols;
        var C = new Matrix(A.nRows, B.nCols, InitialMatrixType.Zero);
        for (var i = 0; i < C.nRows; i++) {
            for (var j = 0; j < C.nCols; j++) {
                for (var k = 0; k < lineLength; k++) {
                    C.value[i][j] += A.value[i][k] * B.value[k][j];
                }
            }
        }
        return C;
    };
    Matrix.prototype.rotate = function (rotationAxis, angle) {
        if (!this.isSquare()) {
            throw "Matrix is not square";
        }
        var dim = this.nRows;
        var C = Matrix.multiply(new Matrix(dim, dim, InitialMatrixType.Rotation, rotationAxis, angle), this);
        this.value = C.value;
    };
    Matrix.prototype.scale = function (rate) {
        for (var i = 0; i < (this.nRows - 1); i++) {
            for (var j = 0; j < (this.nCols - 1); j++) {
                this.value[i][j] *= rate;
            }
        }
    };
    Matrix.perspectiveMatrix = function (angleToVertical, zAngle, scale) {
        console.log(angleToVertical);
        var A = new Matrix(4, 4, InitialMatrixType.Rotation, RotationAxis.X, -angleToVertical);
        A.rotate(RotationAxis.Z, -zAngle);
        A.scale(scale);
        return A;
    };
    Matrix.prototype.toArray = function () {
        var out = [];
        for (var i = 0; i < this.nRows; i++) {
            out.push.apply(out, this.value[i]);
        }
        return out;
    };
    return Matrix;
}());
export { Matrix };
