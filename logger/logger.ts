const pine = require('pine');
const logger = pine({ name: 'shopping-rest-api' });

export class Logger {
  info(message, data) {
    logger.info(`${message}   ${data != undefined ? JSON.stringify(data) : ''}`);
  }

  error(message, data) {
    logger.error(`${message}   ${data != undefined ? JSON.stringify(data) : ''}`);
  }
}