'use strict';
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const nconf = require('nconf');
const helpers = require('./helpers.js');

global.conf = nconf.argv()
.env()
.file({ file: 'config.json' });

const port = conf.get('port');
console.log(`starting server on port ${port}...`);

server.listen(port, function () {
  console.log('server started and listening!');
});

app.get('/:base_key*', function (req, http_res) {
  http_res.json({
    id: req.params['base_key'],
    path: req.params,
    hash: helpers.mapToNiceKey(req.params['base_key']),
    hashes: req.params[0].split('/').map(helpers.mapToNiceKey)
  });
  //1. call the getBestKeyValue to get the best match, and process it
});
