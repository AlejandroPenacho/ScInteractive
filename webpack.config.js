const path = require("path");


module.exports = {
    mode : "development",
    entry : {
        "simpleFunction" : path.resolve(__dirname, "/ts/simpleFunction/script.ts"),
        "spainFlag" : path.resolve(__dirname, "/ts/spainFlag/script.ts"),
        "reactTest" : path.resolve(__dirname, "/ts/reactTest/index.tsx"),
    },
    output : {
        filename : "[name].js",
        path: path.resolve(__dirname, "build")
    },
    module : {
        rules : [ 
            { test:/\.tsx?$/, use : "ts-loader"}
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
}