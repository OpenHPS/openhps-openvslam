import { expect } from 'chai';
import 'mocha';
// Import the module directly so this spec does not pull in the native addon
// (loaded via src/index.ts -> src/openvslam/index.js) which is unavailable outside
// the test Docker images
import { VSLAMConfiguration } from '../../src/nodes/VSLAMConfiguration';

describe('VSLAMConfiguration', () => {
    describe('fromYAMLFile', () => {
        it('should load a configuration from a yaml file', () => {
            const configuration = VSLAMConfiguration.fromYAMLFile('test/data/aist_living_lab_1/config.yaml');
            //console.log(configuration)
        });
    });
});
