const express = require('express');
const cors = require('cors');
const initRoutes = require('../../api/routes/routes');

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors());
initRoutes(app);

module.exports = app