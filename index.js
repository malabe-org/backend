const app = require('./loaders/');
const { port } = require('./config');
const http = require('http');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`Hackathon server is up and running on port ${port} `);
})