require('dotenv').config();
const ImageKit = require("imagekit");
const logger = require('../logger');

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    urlEndpoint: process.env.URL_ENDPOINT
});


module.exports = (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`${ip} ${req.method} ${req.originalUrl} body:${JSON.stringify(req.body)}`);

    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}
