const express = require('express');
const path = require('path');

module.exports = (app) => {
    app.get('/', (req, res) => {
        return res.status(200).json('Hello Sen Diabète');
    })

    app.route('/*').get((req, res) => {
        // TODO('Redirection of all other routes')
        return res.status(404).json('Not Found');
    });
}