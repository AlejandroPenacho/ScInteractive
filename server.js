var express = require("express");
var path = require("path");
var app = express();

const PORT = 8000;


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.use('/', (req, res) => {
	res.sendFile(path.join(__dirname, req.path));
});


app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});
