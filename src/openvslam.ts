import * as path from 'path';

const requirePath = path.join(__dirname, process.env.BINDINGS_DEBUG ? '../build/Debug/native' : '../build/Release/native');
export default require(requirePath);
