
class Matrix {

    constructor(dim){
        this.dim = dim;
        this.value = new Array(dim);

        for (let i=0; i<dim; i++){
            this.value[i] = new Array(dim);

            for (let j=0; j<dim; j++){
                if (i===j){
                    this.value[i][j] = 1;
                } else {
                    this.value[i][j] = 0;
                }
            }
        }
    }

    display() {
        console.log(this.value);
    }
}

var myMat = new Matrix(3);
myMat.display();