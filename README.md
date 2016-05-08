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
