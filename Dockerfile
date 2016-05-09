FROM node:6.1-slim
ADD . /opt/demo_REST_server
RUN cd /opt/demo_REST_server && npm install && npm test
CMD ["node","/opt/demo_REST_server/index.js"]
WORKDIR /opt/demo_REST_server
