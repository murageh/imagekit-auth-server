const fs = require('fs');
const { createLogger, transports, format } = require('winston');

const env = process.env.NODE_ENV;
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const now = new Date();
const logLevel = 'info';

const logger = createLogger({
    level: logLevel,
    levels: {
        fatal: 0,
        crit: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    format: format.combine(
        format.prettyPrint(),
        format.timestamp({
            format: 'DD-MM-YYYY hh:mm:ss A'
        }),
        format.printf((nfo) => `${nfo.timestamp} - ${nfo.level}: ${nfo.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: `${logDir}/app.log`
        })
    ]
});

// Extend logger object to properly log 'Error' types
const origLog = logger.log;

logger.log = function (level, msg) {
    if (msg instanceof Error) {
        // eslint-disable-next-line prefer-rest-params
        const args = Array.prototype.slice.call(arguments);
        args[1] = msg.stack;
        origLog.apply(logger, args);
    } else {
        // eslint-disable-next-line prefer-rest-params
        origLog.apply(logger, arguments);
    }
};

module.exports = logger;

module.exports.stream = {
    write(message) {
        logger.info(message);
        console.log('message = ', message);
    }
};
