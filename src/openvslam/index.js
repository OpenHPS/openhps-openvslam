const path = require('path');

const requirePath = path.join(__dirname, process.env.BINDINGS_DEBUG ? '../../build/Debug/openvslam' : '../../build/Release/openvslam');
module.exports = require(requirePath);
