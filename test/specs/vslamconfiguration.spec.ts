import { expect } from 'chai';
import 'mocha';
import { VSLAMConfiguration } from '../../src';

describe('VSLAMConfiguration', () => {
    describe('fromYAMLFile', () => {

        it('should load a configuration from a yaml file', () => {
            const configuration = VSLAMConfiguration.fromYAMLFile("test/data/aist_living_lab_1/config.yaml");
            //console.log(configuration)
        });

    });
});
