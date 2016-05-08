FROM node:6.1-slim
ADD . /demo_REST_server
RUN cd /demo_REST_server && /usr/bin/npm install
CMD ["/usr/bin/node","/demo_REST_server/index.js"]
WORKDIR /demo_REST_server
