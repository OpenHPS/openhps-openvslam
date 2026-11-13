import { expect } from 'chai';
import 'mocha';
import { Absolute3DPosition, LengthUnit } from '@openhps/core';

// The OpenVSLAM native addon (and the FFmpeg videoio backend of the native
// OpenCV) are only available in the test Docker images. Load the native
// modules lazily and skip the whole suite as pending when they are missing.
let VideoCapture: any;
let Config: any;
let System: any;
let nativeAvailable = false;
try {
    ({ VideoCapture } = require('@u4/opencv4nodejs'));
    ({ Config, System } = require('../../src/openvslam'));
    nativeAvailable = true;
} catch {
    nativeAvailable = false;
}

const suite = nativeAvailable ? describe : describe.skip;
suite('OpenVSLAM', () => {
    describe('configuration', () => {
        it('should create a config', () => {
            const config = new Config('/openvslam/example/euroc/EuRoC_mono.yaml');
            expect(config).to.not.be.undefined;
        });

        it('should create a system from a config', () => {
            const config = new Config('/openvslam/example/euroc/EuRoC_mono.yaml');
            const system = new System(config, '/openvslam/build/orb_vocab.fbow');
            expect(system).to.not.be.undefined;
        });
    });

    it('should perform mapping', () => {
        const video = new VideoCapture('test/data/aist_living_lab_1/video.mp4');
        const config = new Config('test/data/aist_living_lab_1/config.yaml');
        const system = new System(config, '/openvslam/build/orb_vocab.fbow');
        system.startup();
        let frame: any = undefined;
        let timestamp = 0;
        const map_publisher = system.getMapPublisher();
        expect(map_publisher).to.not.be.undefined;
        let frames = 0;
        const start = Date.now();
        do {
            frame = video.read();
            system.feedMonocularFrame(frame, timestamp);
            const pose = map_publisher.getCurrentCamPose();
            const position = new Absolute3DPosition(pose[12], pose[14], pose[13], LengthUnit.METER);
            position.timestamp = timestamp;
            //console.log(position.toVector3());
            timestamp += 1.0 / 30;
            frames++;
            if (frames % 100 === 0) {
                console.log('FPS=', (frames / (Date.now() - start)) * 1000);
                frame = undefined;
            }
        } while (frame);
        system.saveMap('test/data/aist_living_lab_1/map.msg');
        system.shutdown();
    }).timeout('5m');

    it('should perform localization', () => {
        const video = new VideoCapture('test/data/aist_living_lab_1/video.mp4');
        const config = new Config('test/data/aist_living_lab_1/config.yaml');
        const system = new System(config, '/openvslam/build/orb_vocab.fbow');
        system.startup(false);
        system.loadMap('test/data/aist_living_lab_1/map.msg');
        system.disableMapping();
        let frame: any = undefined;
        let timestamp = 0;
        const map_publisher = system.getMapPublisher();
        expect(map_publisher).to.not.be.undefined;
        let frames = 0;
        const start = Date.now();
        do {
            frame = video.read();
            system.feedMonocularFrame(frame, timestamp);
            const pose = map_publisher.getCurrentCamPose();
            const position = new Absolute3DPosition(pose[12], pose[14], pose[13], LengthUnit.METER);
            position.timestamp = timestamp;
            //console.log(position.toVector3());
            timestamp += 1.0 / 30;
            frames++;
            if (frames % 100 === 0) {
                console.log('FPS=', (frames / (Date.now() - start)) * 1000);
                frame = undefined;
            }
        } while (frame);
        system.shutdown();
    }).timeout('5m');
});
