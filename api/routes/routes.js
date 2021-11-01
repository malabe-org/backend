"use strict";
const express = require('express');
const path = require('path');

module.exports = (app) => {
    // user routes
    app.use('/api/users', require('../controllers/user'));
    app.use('/api/request', require('../controllers/request'));
    app.use('/api/treatment', require('../controllers/treatment'));


    //CORS config
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    app.get('/', (req, res) => {
        return res.status(200).json('Hello Sen Diabète');
    })


    app.use((err, req, res, next) => {
        handleError(err, res);
    });

    app.route('/*').get((req, res) => {
        // TODO('Redirection of all other routes')
        return res.status(404).json('Not Found');
    });
}