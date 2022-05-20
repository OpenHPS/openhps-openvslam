import { CallbackSinkNode, Model, ModelBuilder } from '@openhps/core';
import { CameraObject, VideoSource } from '@openhps/opencv';
import { VSLAMFrame, VSLAMProcessingNode, VSLAMSocketViewer } from '../../src';
import 'mocha';
import * as os from 'os';

const DATASET = "aist_entrance_hall_3";
describe(`${DATASET} dataset`, () => {
    let model: Model;
    let sink: CallbackSinkNode<any>;
    let source: VideoSource;

    before((done) => {
        source = new VideoSource({
            autoPlay: false,
            videoSource: `test/data/${DATASET}/video.mp4`,
            source: new CameraObject(),
            fps: 30,
            throttlePush: true
        });
        sink = new CallbackSinkNode();
        ModelBuilder.create()
            .withLogger(console.log)
            .from(source)
            .via(
                new VSLAMProcessingNode({
                    config: `test/data/${DATASET}/config.yaml`,
                    vocabularyFile: '/openvslam/build/orb_vocab.fbow',
                    mapping: true,
                }),
            )
            .to(sink, new VSLAMSocketViewer())
            .build()
            .then((m) => {
                model = m;
                done();
            }).catch(done);
    });

    it('should work', (done) => {
        let frames = 0;
        const start = Date.now();
        sink.callback = (frame: VSLAMFrame) => {
            frames++;
            if (frames % 50 === 0) {
                console.log('FPS=', (frames / (Date.now() - start)) * 1000);
                console.log('USED MEMORY=', os.totalmem() - os.freemem());
            }
            if (frame === undefined) {
                console.log("stopping")
                source.stop();
                model.destroy();
                done();
            }
        };
        model.once('error', done);
        source.play();
    }).timeout(500000000);
});
