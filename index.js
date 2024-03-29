require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const uploadsRouter = require('./routes/uploads.route.js');
const logger = require('./logger');
const methodOverride = require('method-override');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Error-catching middleware
function logErrors(err, req, res, next) {
    console.error(err.stack);
    logger.info(`ERROR: ${JSON.stringify(err)}`);
    next(err);
}

// eslint-disable-next-line consistent-return
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('error', {error: err});
}

app.use(methodOverride());
app.use(logErrors);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`${ip} ${req.method} ${req.originalUrl} body:${JSON.stringify(req.body)}`);
})

app.get('/app', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`${ip} ${req.method} ${req.originalUrl} body:${JSON.stringify(req.body)}`);

    res.redirect(301, process.env.REDIRECTION_URL);
})
// For imagekit uploads
app.use('/upload', uploadsRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`${ip} ${req.method} ${req.originalUrl} body:${JSON.stringify(req.body)}`);
    res.status(statusCode).json({success: false, 'message': err.message});
});

app.listen(port, '0.0.0.0', (err) => {
    console.log(`App listening at http://localhost:${port}`)
    if (err) {
        console.log('Error in server setup');
        logger.info(`SETUP ERROR: ${JSON.stringify(err)}`);
    }
    console.log(`App listening at http://localhost:${port}`);
    logger.info(`App listening at http://localhost:${port}`);
});

// 404
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`${ip} ERR 404 ${req.method} ${req.originalUrl} body:${JSON.stringify(req.body)}`);
    // next()
    res.status(403).send();
});