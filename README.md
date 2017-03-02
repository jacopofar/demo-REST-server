# demo-REST-server
[![Build Status](https://travis-ci.org/jacopofar/demo-REST-server.svg?branch=master)](https://travis-ci.org/jacopofar/demo-REST-server)

Demo of a REST service in Node.js

What it does
------------
The service stores and retrieve the data at a given URL in JSON format, using PUT and GET requests.

When a JSON is __PUT__, if it's well formed and within the size limit, it will be stored under the given path, possibly overwriting the previous one.

Example:

```
curl -X PUT -H "Content-Type: application/json" -d '{"answer":42}' "http://localhost:7000/hello/world/"
```

A __GET__ request on the same path will retrieve the JSON.

Example:
```
curl -X GET -w "\n" -H "Content-Type: application/json" "http://localhost:7000/hello/world/"

{"answer":42}
```

When a key (e.g. `/a/b/c`) is not found, but is present one with shorter prefix (e.g. `/a/b`) an HTTP 302 pointing to that path is returned instead.


A __DELETE__ request will delete a specific key, but only when it's the _exact_ one, otherwise it will only point to the best match but not do anything.

All data is stored as files on the filesystem, using a FS-friendly prefix and the hash of the key to get a tradeoff between diving into the data easily and breaking because a key is not acceptable for the current filesystem (too long, with forbidden characters, etc.)

How to run with Docker
----------------------

The easiest way to run the demo is to use Docker:

```
docker run -p 7000:7000 --name restdemo  jacopofar/demo-rest-server
```
this will start a container with no further actions, which will be available at por 7000 of the host.


The data folder will be inside thte container, hence will be destroyed along with it. If you want to persist use a command like this:

```
docker run -p 7000:7000 --name restdemo --volume=/Users/myuser/Downloads/demodata:/opt/demo_REST_server/data jacopofar/demo-rest-server
```

to mount an arbitrary data folder as a volume. In this case I used the Mac OS path available by default with __docker-machine__

How to run directly
------------------

To run the server locally, you'll need Node.js 4.0 or greater. The program has been tested on Mac OS and Linux, and *should* work on Windows but hasn't been tested there (if you do and it works, please tell me so I can update the README).


Then run:

```
npm install
```

to install the dependencies (including the test ones).

Once installed use ```npm start``` to run the server, or ```npm test``` for the automated testing.

For each configuration option the server uses command line arguments, environment variables and the _config.json_ file in this order.

For example, running:

```node index.js --port 6000```

```port=6000 npm start```

will in both cases use the port 6000, as those options override the _config.json_ ones.
