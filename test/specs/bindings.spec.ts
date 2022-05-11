import { expect } from 'chai';
import 'mocha';
import { Mat, VideoCapture } from '@u4/opencv4nodejs';
import { Absolute3DPosition, LengthUnit } from '@openhps/core';
import { Config, System } from '../../src/openvslam';

describe('OpenVSLAM', () => {
    it('should create a config', () => {
        const config = new Config('/openvslam/example/euroc/EuRoC_mono.yaml');
        expect(config).to.not.be.undefined;
    });

    it('should create a system from a config', () => {
        const config = new Config('/openvslam/example/euroc/EuRoC_mono.yaml');
        const system = new System(config, '/openvslam/build/orb_vocab.fbow');
        expect(system).to.not.be.undefined;
    });

    it('should perform mapping', () => {
        const video = new VideoCapture('test/data/aist_living_lab_1/video.mp4');
        const config = new Config('test/data/aist_living_lab_1/config.yaml');
        const system = new System(config, '/openvslam/build/orb_vocab.fbow');
        system.startup();
        let frame: Mat = undefined;
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
    });

    it('should perform localization', () => {
        const video = new VideoCapture('test/data/aist_living_lab_1/video.mp4');
        const config = new Config('test/data/aist_living_lab_1/config.yaml');
        const system = new System(config, '/openvslam/build/orb_vocab.fbow');
        system.startup(false);
        system.loadMap('test/data/aist_living_lab_1/map.msg');
        system.disableMapping();
        let frame: Mat = undefined;
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
            timestamp += 1.0 / 30;
            frames++;
            if (frames % 100 === 0) {
                console.log('FPS=', (frames / (Date.now() - start)) * 1000);
                frame = undefined;
            }
        } while (frame);
        const landmarks = map_publisher.getAllLandmarks();
        const keyframes = map_publisher.getKeyFrames();
        system.shutdown();
    });
});
