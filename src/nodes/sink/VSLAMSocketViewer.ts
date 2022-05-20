import { 
    AbsolutePosition, 
    LengthUnit, 
    Matrix4, 
    PushOptions, 
    SinkNode, 
    SinkNodeOptions 
} from "@openhps/core";
import { OpenCV } from "@openhps/opencv";
import { VSLAMFrame, VSLAMKeyFrame, VSLAMLandmark } from "../../data";
import * as io from 'socket.io-client';
import * as protobuf from 'protobufjs';
import path = require("path");
import { System } from "../../openvslam";

export class VSLAMSocketViewer<In extends VSLAMFrame> extends SinkNode<In> {
    protected client: io.Socket;
    protected options: VSLAMSocketViewerOptions;
    protected mapSegment: protobuf.Type;
    protected system: System;
    protected keyFrameHashMap: Map<string, number> = new Map();
    protected landmarkFrameHashMap: Map<string, number> = new Map();
    protected currentPoseHash: number;

    constructor(options?: VSLAMSocketViewerOptions) {
        super(options);
        this.options.timeout = this.options.timeout ?? 5000;
        this.options.url = this.options.url ?? "http://localhost:3000";

        this.once('build', this._onBuild.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._initializeProtobuffer().then(() => {
                const url = `${this.options.url}`;

                this.client = io(url, {
                    autoConnect: false,
                    path: "",
                    transports: ["websocket"],
                    timeout: this.options.timeout
                });
    
                const timeout = setTimeout(() => {
                    this.logger('error', {
                        message: 'Unexpected timeout occurred while connecting!',
                        url,
                    });
                    reject(new Error('Unexpected timeout occurred while connecting!'));
                }, this.options.timeout * 2);
    
                this.client.once('connect', () => {
                    this.logger('debug', {
                        message: 'Socket connection made with server!',
                        url
                    });
                    clearTimeout(timeout);
                    // Send reset
                    const map = this.mapSegment.create({
                        messages: [{
                            tag: "RESET_ALL",
                            txt: "reset map data"
                        }]
                    });
                    const mapBuffer = this.mapSegment.encode(map).finish();
                    const mapBase64 = Buffer.from(mapBuffer).toString('base64');
                    this.client.emit("map_publish", mapBase64); 
                    resolve();
                });
                this.client.once('connect_error', (err: any) => {
                    this.logger('error', {
                        message: 'Socket connection failed with server!',
                        url,
                        error: err,
                    });
                    clearTimeout(timeout);
                    reject(err);
                });
                this.client.once('connect_timeout', (err: any) => {
                    this.logger('error', {
                        message: 'Socket connection timeout!',
                        url,
                        error: err,
                    });
                    clearTimeout(timeout);
                    reject(new Error(`Socket connection timeout!`));
                });
                this.client.on('signal', this.onSignal.bind(this));
                // Open connection
                this.logger('debug', {
                    message: 'Connecting to socket server ...',
                    url
                });
                this.client.open();
            }).catch(reject);
        });
    }

    private _initializeProtobuffer(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logger('debug', {
                message: 'Loading map_segment.proto ...',
            });
            protobuf.load(path.join(__dirname, "../../../data/map_segment.proto")).then(root => {
                this.mapSegment = root.lookupType("map_segment.map");
                resolve();
            }).catch(reject);
        });
    }

    protected onSignal(signal: string): void {
        console.log(signal);
        switch (signal) {
            case "disable_mapping_mode":
                break;
            case "enable_mapping_mode":
                break;
            case "reset":
                break;
            case "terminate":
                break;
            
        }
    }

    onPush(frame: In, options?: PushOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (frame.system) {
                this.system = frame.system;
            }

            // Frame publisher
            this.serializeImage(frame).then(image => {
                if (image) {
                    this.client.emit("frame_publish", image);
                }
            }).catch(reject);
            // Map publisher
            const map = this.serializeFrame(frame);
            if (map) {
                const mapBuffer = this.mapSegment.encode(map).finish();
                const mapBase64 = Buffer.from(mapBuffer).toString('base64');
                this.client.emit("map_publish", mapBase64); 
            }
         
            resolve();
        });
    }
    
    protected serializeImage(frame: In): Promise<string> {
        return new Promise((resolve, reject) => {
            const mat: OpenCV.Mat = frame.image;
            const aspect = mat.cols / mat.rows;
            const resizedRows = 256;
            mat.resizeAsync(new OpenCV.Size(resizedRows, resizedRows * aspect)).then(resizedMat => {
                return OpenCV.imencodeAsync(".jpg", resizedMat, [OpenCV.IMWRITE_WEBP_QUALITY]);
            }).then(buffer => {
                if (buffer) {
                    return resolve(buffer.toString("base64"));
                }
                resolve(undefined);
            }).catch(reject);
        });
    }

    protected serializeFrame(frame: In): protobuf.Message {
        if (this.mapSegment == undefined) {
            return undefined;
        }

        // Do not update if camera pose has not changed
        const poseHash = this.getPoseHash(frame.cameraPose);
        if (poseHash === this.currentPoseHash) {
            return undefined;
        }
        this.currentPoseHash = poseHash;

        const publisher = frame.system.getMapPublisher();
        const keyframes = publisher.getKeyFrames()
            .map(obj => VSLAMKeyFrame.fromNative(obj))
            .filter(obj => {
                const hash = this.getPoseHash(obj.cameraPose);
                if (this.keyFrameHashMap.has(obj.uid) && this.keyFrameHashMap.get(obj.uid) === hash) {
                    return false; // Already send
                }
                this.keyFrameHashMap.set(obj.uid, hash); // Update hash
                return true;
            })
            .map(obj => ({
                id: obj.uid,
                pose: {
                    pose: obj.cameraPose.elements
                }
            }));
        const landmarks = publisher.getAllLandmarks()
            .map(obj => VSLAMLandmark.fromNative(obj))
            .filter(obj => {
                const hash = this.getPositionHash(obj.getPosition());
                if (this.landmarkFrameHashMap.has(obj.uid) && this.landmarkFrameHashMap.get(obj.uid) === hash) {
                    return false; // Already send
                }
                this.landmarkFrameHashMap.set(obj.uid, hash); // Update hash
                return true;
            })
            .map(obj => ({
                id: obj.uid,
                color: [0, 0, 0],
                coords: obj.getPosition().toVector3(LengthUnit.METER).toArray()
            }));
        const localLandmarks = publisher.getLocalLandmarks()
            .map(obj => VSLAMLandmark.fromNative(obj))
            .map(obj => ({
                id: obj.uid,
                color: [0, 0, 0],
                coords: obj.getPosition().toVector3(LengthUnit.METER).toArray()
            }));

        return this.mapSegment.create({
            currentFrame: {
                pose: frame.cameraPose.elements
            },
            keyframes,
            edges: [],
            landmarks,
            localLandmarks,
            messages: [{
                tag: "0",
                txt: "only map data"
            }]
        });
    }

    protected getPoseHash(pose: Matrix4): number {
        return pose.elements[8] + pose.elements[9] + pose.elements[10];
    }

    protected getPositionHash(position: AbsolutePosition): number {
        return position.toVector3().toArray().reduce((a, b) => a + b, 0);
    }

}

export interface VSLAMSocketViewerOptions extends SinkNodeOptions {
    url: string;
    timeout?: number;
    framePublisher?: boolean;
    mapPublisher?: boolean;
}
