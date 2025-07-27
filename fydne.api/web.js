const config = require('./config');
const express = require('express');
const http = require('http');

module.exports = () => {
    const _web = express();
    _web
    .disable('x-powered-by')
    .use(require('./web-router'))
    .use(function(req, res){
        res.status(404).json({status:'error', message: 'not found'});
    })


    http.createServer(_web).listen(4623, 'localhost');
}