# demo-REST-server
Demo of a REST service in Node.js

What it does
------------
The service stores and retrieve the data at a given URL in JSON format, using PUT and GET requests.

When a key (e.g. `/a/b/c`) is not found, but is present a shorter path (e.g. `/a/b`) an HTTP 302 pointing to that path is returned instead.
