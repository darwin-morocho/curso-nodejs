const express = require('express');
const bodyParser = require('body-parser');
const phone = require('phone');
const { multiplication } = require("./utils/operations");
const apiV1 = require('./routes/v1');

const PORT = 5000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



apiV1(app);

app.use((req, res) => {
    res.status(404).send("NOT FOUND");
});




app.listen(PORT, () => {
    console.log('running on ' + PORT);
});

