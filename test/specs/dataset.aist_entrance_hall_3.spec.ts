import { CallbackSinkNode, Model, ModelBuilder } from '@openhps/core';
import { CameraObject, VideoFrame, VideoSource } from '@openhps/opencv';
import { VSLAMProcessingNode } from '../../src';
import { expect } from 'chai';
import 'mocha';

describe('aist_entrance_hall_3 dataset', () => {
    let model: Model;
    let sink: CallbackSinkNode<any>;
    let source: VideoSource;

    before((done) => {
        source = new VideoSource({
            autoPlay: false,
            videoSource: "test/data/aist_entrance_hall_3/video.mp4",
            source: new CameraObject()
        });
        sink = new CallbackSinkNode();
        ModelBuilder.create()
            .from(source)
            .via(new VSLAMProcessingNode({
                config: "test/data/aist_entrance_hall_3/config.yaml",
                vocabularyFile: "/openvslam/build/orb_vocab.fbow",
                mapping: true,
                mapDatabaseFile: "test/data/aist_entrance_hall_3/map.msg",
                persistMapping: true,
            }))
            .to(sink)
            .build().then(m => {
                model = m;
                done();
            });
    });

    it('should work', (done) => {
        sink.callback = (frame: VideoFrame) => {
            console.log(frame.source.position.toVector3().toArray());
            source.stop();
            done();
        };
        source.play();
    }).timeout(10000000);
});