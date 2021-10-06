import { expect } from 'chai';
import 'mocha';
import { CAP_PROP_FPS, Mat, VideoCapture } from 'opencv4nodejs';
import { Absolute3DPosition, LengthUnit } from '@openhps/core';
import { Config, System, MapPublisher } from '../../src/openvslam';

describe('OpenVSLAM', () => {

    it('should create a config', () => {
        console.log(new Config("/openvslam/example/euroc/EuRoC_mono.yaml"))
    });

    it('should create a system from a config', () => {
        const config = new Config("/openvslam/example/euroc/EuRoC_mono.yaml");
        new System(config, "/openvslam/build/orb_vocab.fbow");
    });

    it('should perform mapping', () => {    
        const video = new VideoCapture("test/data/aist_living_lab_1/video.mp4");
        const config = new Config("test/data/aist_living_lab_1/config.yaml");
        const system  = new System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup();
        let frame: Mat = undefined;
        let timestamp = 0;
        const map_publisher = system.getMapPublisher();
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
                console.log("FPS=", (frames / (Date.now() - start)) * 1000);
                frame = undefined;
            }
        } while(frame);
        system.shutdown();
    });

    it('should perform localization', () => {    
        const video = new VideoCapture("test/data/aist_living_lab_1/video.mp4");
        const config = new Config("test/data/aist_living_lab_1/config.yaml");
        const system  = new System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup(false);
        system.loadMap("test/data/aist_living_lab_1/map.msg");
        system.disableMapping();
        let frame: Mat = undefined;
        let timestamp = 0;
        const map_publisher = system.getMapPublisher();
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
                console.log("FPS=", (frames / (Date.now() - start)) * 1000);
                frame = undefined;
            }
        } while(frame);
        system.shutdown();
    });
});