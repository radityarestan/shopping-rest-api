import * as http from 'http';
import App from './app';
import { Logger } from './logger/logger';

const PORT = process.env.PORT || 8080;
const logger = new Logger();

const httpServer = http.createServer(App);
httpServer.listen(PORT, () => logger.info(`The server is running on port ${PORT}`, null));

module.exports = App;