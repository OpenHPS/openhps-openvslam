import * as path from 'path';

const requirePath = path.join(
    __dirname,
    process.env.BINDINGS_DEBUG ? '../build/Debug/openvslam' : '../build/Release/openvslam',
);
export default require(requirePath);
