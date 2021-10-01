import { CallbackSinkNode, Model, ModelBuilder } from '@openhps/core';
import { CameraObject, VideoFrame, VideoSource } from '@openhps/opencv';
import { VSLAMProcessingNode } from '../../src';
import { CSVDataSink } from '@openhps/csv';
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
            .to(sink, new CSVDataSink("test/data/aist_entrance_hall_3/output.csv", [
                { id: "x", title: "x" },
                { id: "y", title: "y" },
                { id: "z", title: "z" }
            ], frame => {
                return {
                    x: frame.source.position.x,
                    y: frame.source.position.y,
                    z: frame.source.position.z,
                }
            }))
            .build().then(m => {
                model = m;
                done();
            });
    });

    it('should work', (done) => {
        let frames = 0;
        const start = Date.now();
        sink.callback = (frame: VideoFrame) => {
            //console.log(frame.source.position.toVector3().toArray());
          //  source.stop();
           // done();
           frames++;
           if (frames % 100 === 0) {
               console.log("FPS=", (frames / (Date.now() - start)) * 1000);
           }
        };
        source.play();
    }).timeout(10000000);
});