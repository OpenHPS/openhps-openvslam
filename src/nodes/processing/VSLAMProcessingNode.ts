import { Absolute3DPosition, LengthUnit, Matrix4, Orientation, ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import {
    CameraObject,
    DepthImageFrame,
    StereoCameraObject,
    StereoVideoFrame,
    VideoFrame,
    ColorOrder,
} from '@openhps/opencv';
import { System, Config, MapPublisher, FramePublisher } from '../../openvslam';
import * as fs from 'fs';
import { VSLAMFrame } from '../../data';

/**
 * VSLAM processing node is a node that takes in a video frame and uses
 * OpenVSLAM to process the video frame.
 */
export class VSLAMProcessingNode<
    In extends VideoFrame | StereoVideoFrame | DepthImageFrame,
    Out extends VSLAMFrame,
> extends ProcessingNode<In, Out> {
    protected _config: Config;
    protected _system: System;
    protected _mapPublisher: MapPublisher;
    protected _framePublisher: FramePublisher;
    protected options: VSLAMProcessingNodeOptions;

    constructor(options?: VSLAMProcessingNodeOptions) {
        super(options);

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve) => {
            if (typeof this.options.config === 'string') {
                this._config = new Config(this.options.config);
            } else {
                const parsedConfig = this._parseConfiguration(this.options.config);
                this._config = new Config(parsedConfig);
            }
            this._system = new System(this._config, this.options.vocabularyFile);

            this._system.startup(this.options.mapDatabaseFile === undefined);
            if (this.options.mapDatabaseFile && fs.existsSync(this.options.mapDatabaseFile)) {
                this._system.loadMap(this.options.mapDatabaseFile);
            }

            if (this.options.mapping) {
                this._system.enableMapping();
            } else {
                this._system.disableMapping();
            }

            this._mapPublisher = this._system.getMapPublisher();
            this._framePublisher = this._system.getFramePublisher();
            resolve();
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve) => {
            if (this.options.mapDatabaseFile && this.options.mapping && this.options.persistMapping) {
                // Save mapping
                this._system.saveMap(this.options.mapDatabaseFile);
            }
            this._system.shutdown();
            this._system = null;
            this._config = null;
            resolve();
        });
    }

    process(data: In): Promise<Out> {
        return new Promise((resolve, reject) => {
            try {
                const out = new VSLAMFrame(data);
                // Process the frame differently depending on the type of video frame
                if (data instanceof VideoFrame) {
                    out.image = data.image;
                    this._system.feedMonocularFrame(data.image, data.createdTimestamp);
                } else if (data instanceof StereoVideoFrame) {
                    out.image = data.left.image;
                    this._system.feedStereoFrame(data.left.image, data.right.image, data.createdTimestamp);
                } else if (data instanceof DepthImageFrame) {
                    out.image = data.image;
                    this._system.feedRGBDFrame(data.image, data.depth, data.createdTimestamp);
                }

                // Fetch the current camera pose
                const pose = new Matrix4().fromArray(this._mapPublisher.getCurrentCamPose());
                // Convert the pose to a position
                const position = new Absolute3DPosition(pose.elements[12], pose.elements[14], pose.elements[13], LengthUnit.METER);
                position.timestamp = data.createdTimestamp;
                position.orientation = Orientation.fromRotationMatrix(pose);
                data.source.setPosition(position);
                out.system = this._system;

                resolve(out as Out);
            } catch (ex) {
                reject(ex);
            }
        });
    }

    private _parseConfiguration(config: OpenVSLAMConfiguration): any {
        return {
            camera: {
                name: config.camera.displayName,
                setup: config.camera instanceof StereoCameraObject ? 'stereo' : 'monocular',
                model: 'fisheye',
                fx: config.camera.cameraMatrix.elements[0],
                fy: config.camera.cameraMatrix.elements[4],
                cx: config.camera.cameraMatrix.elements[6],
                cy: config.camera.cameraMatrix.elements[7],
                k1: config.camera.distortionCoefficients[0],
                k2: config.camera.distortionCoefficients[1],
                k3: config.camera.distortionCoefficients[2],
                k4: config.camera.distortionCoefficients[3],
                fps: config.camera.fps,
                cols: config.camera.cols,
                rows: config.camera.rows,
                color_order: ColorOrder[config.camera.colorOrder],
            },
        };
    }
}

export interface VSLAMProcessingNodeOptions extends ProcessingNodeOptions {
    /**
     * Enable mapping and localization
     */
    mapping?: boolean;
    /**
     * Configuration
     */
    config?: string | OpenVSLAMConfiguration;
    /**
     * Vocabulary file
     */
    vocabularyFile?: string;
    /**
     * Map database file (MSG) for loading and storage
     */
    mapDatabaseFile?: string;
    /**
     * Persist the mapping to the map database file
     */
    persistMapping?: boolean;
}

export interface OpenVSLAMConfiguration {
    camera: CameraObject;
}
