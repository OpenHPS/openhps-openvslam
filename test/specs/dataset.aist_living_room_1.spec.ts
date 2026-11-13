import { CallbackSinkNode, Model, ModelBuilder } from '@openhps/core';
import 'mocha';
import * as os from 'os';

// The OpenVSLAM native addon and the native OpenCV (FFmpeg videoio) are only
// available in the test Docker images. Load the native modules lazily and skip
// the whole suite as pending when they are missing.
let VideoSource: any;
let CameraObject: any;
let VSLAMProcessingNode: any;
let VSLAMService: any;
let VSLAMSocketPublisher: any;
let nativeAvailable = false;
try {
    ({ VideoSource, CameraObject } = require('@openhps/opencv'));
    ({ VSLAMProcessingNode, VSLAMService, VSLAMSocketPublisher } = require('../../src'));
    const SegfaultHandler = require('segfault-handler');
    SegfaultHandler.registerHandler('crash.log');
    nativeAvailable = true;
} catch {
    nativeAvailable = false;
}

const DATASET = 'aist_living_lab_3';
const suite = nativeAvailable ? describe : describe.skip;
suite(`${DATASET} dataset`, () => {
    let model: Model;
    let sink: CallbackSinkNode<any>;
    let source: any;

    before((done) => {
        source = new VideoSource({
            autoPlay: false,
            videoSource: `test/data/${DATASET}/video.mp4`,
            source: new CameraObject(),
            fps: 30,
            throttlePush: true,
        });
        sink = new CallbackSinkNode();
        ModelBuilder.create()
            .withLogger(console.log)
            .addService(
                new VSLAMService({
                    vocabularyFile: '/openvslam/build/orb_vocab.fbow',
                }),
            )
            .from(source)
            .via(
                new VSLAMProcessingNode({
                    config: `test/data/${DATASET}/config.yaml`,
                    mapping: false,
                    mapDatabaseFile: `test/data/aist_living_lab_1/map_complete.msg`,
                    persistMapping: false,
                }),
            )
            .to(
                sink,
                new VSLAMSocketPublisher({
                    url: 'http://localhost:3000',
                }),
            )
            .build()
            .then((m) => {
                model = m;
                done();
            })
            .catch(done);
    });

    it('should work', (done) => {
        let frames = 0;
        const start = Date.now();
        sink.callback = (frame: any) => {
            frames++;
            if (frames % 50 === 0) {
                console.log('FPS=', (frames / (Date.now() - start)) * 1000);
                console.log('USED MEMORY=', os.totalmem() - os.freemem());
            }
            if (frame === undefined) {
                console.log('stopping');
                source.stop();
                model.destroy();
                done();
            }
        };
        model.once('error', done);
        source.play();
    }).timeout('10m');
});
