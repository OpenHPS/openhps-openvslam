import { expect } from 'chai';
import 'mocha';
import { CAP_PROP_FPS, Mat, VideoCapture } from 'opencv4nodejs';
import { Absolute3DPosition, LengthUnit } from '@openhps/core';
import openvslam from '../../src/openvslam';

describe('Bindings', () => {
    it('should initialize', () => {
        console.log(openvslam)
    });

    it('should create a config', () => {
        console.log(new openvslam.Config("/openvslam/example/euroc/EuRoC_mono.yaml"))
    });

    it('should create a system from a config', () => {
        const config = new openvslam.Config("/openvslam/example/euroc/EuRoC_mono.yaml");
        const system  = new openvslam.System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup();
    });

    it('should use opencv4nodejs', () => {    
        const video = new VideoCapture("test/data/aist_living_lab_1/video.mp4");
        const config = new openvslam.Config("test/data/aist_living_lab_1/equirectangular.yaml");
        const system  = new openvslam.System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup();
        let frame: Mat = undefined;
        let timestamp = 0;
        const map_publisher = new openvslam.MapPublisher(system);
        let frames = 0;
        const start = Date.now();
        do {
            frame = video.read();
            system.feed_monocular_frame(frame, timestamp);
            const pose = map_publisher.get_current_cam_pose();
            const position = new Absolute3DPosition(pose[12], pose[14], pose[13], LengthUnit.METER);
            position.timestamp = timestamp;
            //console.log(position.toVector3());
            timestamp += 1.0 / 30;
            frames++;
            if (frames % 100 === 0)
                console.log("FPS=", (frames / (Date.now() - start)) * 1000);
        } while(frame);
    });
});