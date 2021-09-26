import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import { Mat, VideoCapture } from 'opencv4nodejs';
import { Absolute3DPosition, LengthUnit, Matrix4 } from '@openhps/core';

const requirePath = path.join(__dirname, process.env.BINDINGS_DEBUG ? '../../build/Debug/native' : '../../build/Release/native');
var addon = require(requirePath);

describe('Bindings', () => {
    it('should initialize', () => {
        console.log(addon)
    });

    it('should create a config', () => {
        console.log(addon.Config("/openvslam/example/euroc/EuRoC_mono.yaml"))
    });

    it('should create a system from a config', () => {
        const config = addon.Config("/openvslam/example/euroc/EuRoC_mono.yaml");
        const system  = addon.System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup();
    });

    it('should use opencv4nodejs', () => {    
        const video = new VideoCapture("test/data/aist_living_lab_1/video.mp4");
        const config = addon.Config("test/data/aist_living_lab_1/equirectangular.yaml");
        const system  = addon.System(config, "/openvslam/build/orb_vocab.fbow");
        system.startup();
        let frame: Mat = undefined;
        let timestamp = 0;
        do {
            frame = video.read();
            system.feed_monocular_frame(frame, timestamp);
            const pose = system.get_current_cam_pose();
            const position = new Absolute3DPosition(pose[12], pose[14], pose[13], LengthUnit.METER);
            position.timestamp = timestamp;
            console.log(position.toVector3());
            timestamp += 1.0 / 30;
        } while(frame);
    });
});