'use strict';
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const nconf = require('nconf');
const helpers = require('./helpers.js');
const bodyParser = require('body-parser');
const fs = require('fs');
//needed for testing
module.exports.server = server;

global.conf = nconf.argv()
.env()
.file({ file: 'config.json' });

app.use(bodyParser.raw({ type: () => true, limit: conf.get('json_max_size') }));


const port = conf.get('port');
console.log(`starting server on port ${port}...`);

fs.mkdir(conf.get('data_folder'), (err) =>{
  if(err) {
    console.log(err);
    return;
  }
  server.listen(port, function () {
    console.log('server started and listening!');
  });
});


app.get('/:base_key*', function (req, http_res) {
  const raw_keys = [req.params['base_key']].concat(req.params[0].split('/').slice(1));
  //filesystem-friendly keys array
  const fs_keys = raw_keys.map(helpers.mapToNiceKey);
  helpers.getBestKeyValue(fs_keys, function (err, foundkey, data) {
    if (err) {
      console.log('error', err);
      http_res.status(500).json(err);
      return;
    }
    if(foundkey.length === 0){
      http_res.status(404).send('key completely unknown');
      return;
    }
    if (foundkey.length !== raw_keys.length) {
      //it was found but it wasn't an exact match, send a redirect
      console.log('redirecting a key: ' + raw_keys.join('/') +  ' => ' + raw_keys.slice(0, foundkey.length).join('/'));
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
      console.log(fs_keys, err);
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
