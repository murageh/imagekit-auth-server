// import 'dotenv/config';
require('dotenv').config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    urlEndpoint: process.env.URL_ENDPOINT
});


module.exports = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}
