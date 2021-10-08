import { Absolute3DPosition, LengthUnit, ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { StereoVideoFrame, VideoFrame } from '@openhps/opencv';
import { System, Config, MapPublisher, FramePublisher } from '../../openvslam';
import * as fs from 'fs';

export class VSLAMProcessingNode<
    In extends VideoFrame | StereoVideoFrame,
    Out extends VideoFrame | StereoVideoFrame,
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
            this._config = new Config(this.options.config);
            this._system = new System(this._config, this.options.vocabularyFile);

            this._system.startup(this.options.mapDatabaseFile !== undefined);
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
                if (data instanceof VideoFrame) {
                    this._system.feedMonocularFrame(data.image, data.createdTimestamp);
                } else if (data instanceof StereoVideoFrame) {
                    this._system.feedStereoFrame(data.left.image, data.right.image, data.createdTimestamp);
                }

                // Fetch the current camera pose
                const pose = this._mapPublisher.getCurrentCamPose();
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
    /**
     * Enable mapping and localization
     */
    mapping?: boolean;
    /**
     * Configuration
     */
    config?: string;
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
