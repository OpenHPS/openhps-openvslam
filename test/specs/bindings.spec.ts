import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
const requirePath = path.join(__dirname, process.env.BINDINGS_DEBUG ? '../../build/Debug/native' : '../../build/Release/native');
var addon = require(requirePath);

describe('Bindings', () => {
    it('should initialize', () => {
        console.log(addon.Config("/openvslam/example/euroc/EuRoC_mono.yaml", ""))
    });
});