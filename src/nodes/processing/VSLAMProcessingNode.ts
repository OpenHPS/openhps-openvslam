import { Absolute3DPosition, LengthUnit, ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { StereoVideoFrame, VideoFrame } from '@openhps/opencv';
import openvslam from '../../openvslam';
import * as fs from 'fs';

export class VSLAMProcessingNode<
    In extends VideoFrame | StereoVideoFrame,
    Out extends VideoFrame | StereoVideoFrame,
> extends ProcessingNode<In, Out> {
    protected _config: any;
    protected _system: any;
    protected _mapPublisher: any;
    protected _framePublisher: any;
    protected options: VSLAMProcessingNodeOptions;

    constructor(options?: VSLAMProcessingNodeOptions) {
        super(options);

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve) => {
            this._config = new openvslam.Config(this.options.config);
            this._system = new openvslam.System(this._config, this.options.vocabularyFile);

            this._system.startup(this.options.mapDatabaseFile !== undefined);
            if (this.options.mapDatabaseFile && fs.existsSync(this.options.mapDatabaseFile)) {
                this._system.load_map_database(this.options.mapDatabaseFile);
            }

            if (this.options.mapping) {
                this._system.enable_mapping_module();
            } else {
                this._system.disable_mapping_module();
            }

            this._mapPublisher = new openvslam.MapPublisher(this._system);
            this._framePublisher = new openvslam.FramePublisher(this._system);
            resolve();
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve) => {
            if (this.options.mapDatabaseFile && this.options.mapping && this.options.persistMapping) {
                // Save mapping
                this._system.save_map_database(this.options.mapDatabaseFile);
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
                if (data instanceof VideoFrame) {
                    this._system.feed_monocular_frame(data.image, data.createdTimestamp);
                } else if (data instanceof StereoVideoFrame) {
                    this._system.feed_stereo_frame(data.left.image, data.right.image, data.createdTimestamp);
                }

                // Fetch the current camera pose
                const pose = this._mapPublisher.get_current_cam_pose();
                const position = new Absolute3DPosition(pose[12], pose[14], pose[13], LengthUnit.METER);
                position.timestamp = data.createdTimestamp;
                data.source.setPosition(position);

                resolve(data as unknown as Out);
            } catch (ex) {
                reject(ex);
            }
        });
    }
}

export interface VSLAMProcessingNodeOptions extends ProcessingNodeOptions {
    mapping?: boolean;
    config?: string;
    vocabularyFile?: string;
    mapDatabaseFile?: string;
    persistMapping?: boolean;
}
