'use strict';
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const nconf = require('nconf');
const helpers = require('./helpers.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');

//observer to be called when ready, used for testing
let onReady;
//call the observer immediately if the server has already benn started
let isRunning;

module.exports.onReady = function (cb) {
  if (isRunning) {
    cb();
  }
  else {
    onReady = cb;
  }
};

module.exports.terminate = function () {
  log.info('closing the server');
  server.close();
  isRunning = false;
};

const startServer = function () {
  if (isRunning) return;

  global.conf = nconf.argv()
  .env()
  .file({ file: 'config.json' });
  global.log = winston;
  if (conf.get('http_logging')) {
    app.use(morgan(':date[iso] :method :url :status  - :res[content-length] :response-time ms'));
  }

  app.use(bodyParser.raw({ type: () => true, limit: conf.get('json_max_size') }));


  const port = conf.get('port');
  log.info(`starting server on port ${port}...`);

  fs.mkdir(conf.get('data_folder'), (err) => {
    log.info('creating data folder ' + conf.get('data_folder'));
    if (err && err.code !== 'EEXIST') {
      log.error(err);
      process.exit(2);
    }
    server.listen(port, function () {
      log.info('server started and listening!');
      //tell the test suite, if present, that the server is ready
      if (onReady) onReady();
      isRunning = true;
    });
  });
};

module.exports.startServer = startServer;

startServer();

app.get('/:base_key*', function (req, http_res) {
  const raw_keys = [req.params['base_key']].concat(req.params[0].split('/').slice(1));
  //filesystem-friendly keys array
  const fs_keys = raw_keys.map(helpers.mapToNiceKey);
  helpers.getBestKeyValue(fs_keys, function (err, foundkey, data) {
    if (err) {
      log.error('error' + JSON.stringify(err));
      http_res.status(500).json(err);
      return;
    }
    if (foundkey.length === 0){
      http_res.status(404).send('key completely unknown');
      return;
    }
    if (foundkey.length !== raw_keys.length) {
      //it was found but it wasn't an exact match, send a redirect
      log.debug('redirecting a key: ' + raw_keys.join('/') +  ' => ' + raw_keys.slice(0, foundkey.length).join('/'));
      http_res.redirect('/' + raw_keys.slice(0, foundkey.length).join('/'));
      return;
    }
    /*
    http_res.json({
    base: req.params['base_key'],
    added: req.params[0].split('/').slice(1),
    pars: req.params[0],
    keys: [req.params['base_key']].concat(req.params[0].split('/').slice(1)),
    fs_keys: fs_keys,
    found: foundkey,
    data: data
  });*/
  http_res.json(data);
});
});

app.put('/:base_key*', function (req, http_res) {
  if (req.get('Content-Type') !== 'application/json') {
    http_res.status(400).send('content type must be application/json');
    return;
  }
  try {
    JSON.parse(req.body.toString())
  }
  catch (e) {
    http_res.status(400).send('not a valid JSON');
    return;
  }
  //filesystem-friendly keys array
  const fs_keys = [helpers.mapToNiceKey(req.params['base_key'])].concat(req.params[0].split('/').slice(1).map(helpers.mapToNiceKey));

  helpers.writeKV(fs_keys, req.body.toString(), function (err, overwritten) {
    if (err) {
      http_res.status(500).json(err);
      return;
    }
    if(overwritten){
      http_res.status(200).send('value overwritten');
    }
    else{
      http_res.status(201).send('value created');
    }
  });
});
