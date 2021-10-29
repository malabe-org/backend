const express = require('express');
const initRoutes = require('../../api/routes/routes.js');

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

initRoutes(app)


module.exports = app