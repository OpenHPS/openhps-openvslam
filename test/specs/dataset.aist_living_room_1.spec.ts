import { CallbackSinkNode, Model, ModelBuilder } from '@openhps/core';
import { CameraObject, VideoSource } from '@openhps/opencv';
import { VSLAMFrame, VSLAMProcessingNode, VSLAMService, VSLAMSocketPublisher } from '../../src';
import 'mocha';
import * as os from 'os';
const SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('crash.log');
const DATASET = "aist_living_lab_3";
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
            .addService(new VSLAMService({
                vocabularyFile: '/openvslam/build/orb_vocab.fbow',
            }))
            .from(source)
            .via(
                new VSLAMProcessingNode({
                    config: `test/data/${DATASET}/config.yaml`,
                    mapping: false,
                    mapDatabaseFile: `test/data/aist_living_lab_1/map_complete.msg`,
                    persistMapping: false
                }),
            )
            .to(

                sink,
                new VSLAMSocketPublisher({
                    url: "http://localhost:3000"
                })
            )
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
    }).timeout('10m');
});
