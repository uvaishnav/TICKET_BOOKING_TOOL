const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../data/logs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'bms-automation' },
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'errors.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'automation.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
