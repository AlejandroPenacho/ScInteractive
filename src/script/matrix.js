"use strict";
var Mesh = /** @class */ (function () {
    function Mesh(nXvalues, nYvalues, xRange, yRange) {
        // Initializes a bi-dimiensional mesh with points.
        this.nXvalues = nXvalues;
        this.nYvalues = nYvalues;
        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = [0, 0];
        this.xValues = new Array(nXvalues);
        this.yValues = new Array(nYvalues);
        this.zValues = new Array(nXvalues);
        var initialX = xRange[0];
        var initialY = yRange[0];
        var deltaX = (xRange[1] - xRange[0]) / (nXvalues - 1);
        var deltaY = (yRange[1] - yRange[0]) / (nYvalues - 1);
        for (var i = 0; i < nXvalues; i++) {
            this.xValues[i] = initialX + deltaX * i;
            this.zValues[i] = new Array(nYvalues);
        }
        for (var j = 0; j < nYvalues; j++) {
            this.yValues[j] = initialY + deltaY * j;
        }
    }
    Mesh.prototype.introduceFunction = function (zFunction) {
        var z0 = zFunction(this.xValues[0], this.yValues[1]);
        this.zRange = [z0, z0];
        for (var i = 0; i < this.nXvalues; i++) {
            for (var j = 0; j < this.nYvalues; j++) {
                this.zValues[i][j] = zFunction(this.xValues[i], this.yValues[j]);
                if (this.zValues[i][j] < this.zRange[0]) {
                    this.zRange[0] = this.zValues[i][j];
                }
                else if (this.zValues[i][j] > this.zRange[1]) {
                    this.zRange[1] = this.zValues[i][j];
                }
            }
        }
    };
    Mesh.prototype.generateWebGLdata = function (normalized) {
        if (normalized === void 0) { normalized = false; }
        var nValues = 18 * (this.nXvalues - 1) * (this.nYvalues - 1);
        var buffer = new Array();
        for (var i = 0; i < (this.nXvalues - 1); i++) {
            for (var j = 0; j < (this.nYvalues - 1); j++) {
                var x0 = this.xValues[i];
                var x1 = this.xValues[i + 1];
                var x2 = this.xValues[i];
                var x3 = this.xValues[i + 1];
                var y0 = this.yValues[j];
                var y1 = this.yValues[j];
                var y2 = this.yValues[j + 1];
                var y3 = this.yValues[j + 1];
                var z0 = this.zValues[i][j];
                var z1 = this.zValues[i + 1][j];
                var z2 = this.zValues[i][j + 1];
                var z3 = this.zValues[i + 1][j + 1];
                var zeroIndex = (i * this.nYvalues + j) * 18;
                buffer.push.apply(buffer, [x0, y0, z0, x1, y1, z1, x2, y2, z2,
                    x1, y1, z1, x3, y3, z3, x2, y2, z2]);
            }
        }
        if (normalized) {
            var deltaX = 2 / (this.xRange[1] - this.xRange[0]);
            var deltaY = 2 / (this.yRange[1] - this.yRange[0]);
            var deltaZ = 1 / (this.zRange[1] - this.zRange[0]);
            for (var i = 0; i < nValues; i += 3) {
                buffer[i] = (buffer[i] - this.xRange[0]) * deltaX - 1;
                buffer[i + 1] = (buffer[i + 1] - this.yRange[0]) * deltaY - 1;
                buffer[i + 2] = (buffer[i + 2] - this.zRange[0]) * deltaZ;
            }
        }
        return { vertexBuffer: buffer,
            nValues: nValues,
            xRange: this.xRange,
            yRange: this.yRange,
            zRange: this.zRange };
    };
    return Mesh;
}());
export { Mesh };
