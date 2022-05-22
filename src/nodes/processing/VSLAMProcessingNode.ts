import { Matrix4, ProcessingNode, ProcessingNodeOptions, TimeService, TimeUnit } from '@openhps/core';
import {
    DepthImageFrame,
    StereoVideoFrame,
    VideoFrame,
} from '@openhps/opencv';
import * as fs from 'fs';
import { VSLAMFrame } from '../../data';
import { VSLAMService } from '../../service/VSLAMService';

/**
 * VSLAM processing node is a node that takes in a video frame and uses
 * OpenVSLAM to process the video frame.
 */
export class VSLAMProcessingNode<
    In extends VideoFrame | StereoVideoFrame | DepthImageFrame,
    Out extends VSLAMFrame,
> extends ProcessingNode<In, Out> {
    protected options: VSLAMProcessingNodeOptions;
    protected service: VSLAMService;
    protected systems: string[] = [];

    constructor(options?: VSLAMProcessingNodeOptions) {
        super(options);
        this.options.mapping = this.options.mapping === undefined ? true : this.options.mapping;

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.model) {
                return reject(new Error(`Unable to start VSLAM processing without VSLAMService!`));
            }
            this.service = this.model.findService(VSLAMService);
            this.service.createSystem(this.options.config).then(uid => {
                this.systems.push(uid);
                return this.service.findSystemByUID(uid);
            }).then(system => {
                const mapDatabaseExists =
                    this.options.mapDatabaseFile !== undefined && 
                    fs.existsSync(this.options.mapDatabaseFile);

                if (mapDatabaseExists) {
                    this.logger('debug', {
                        msg: `Loading OpenVSLAM map database ...`,
                        file: this.options.mapDatabaseFile
                    });
                    system.loadMap(this.options.mapDatabaseFile);
                }

                system.startup(!mapDatabaseExists);

                // Global mapper
                if (this.options.mapping) {
                    this.logger('debug', {
                        msg: `Enable mapping for OpenVSLAM`,
                    });
                    system.enableMapping();
                } else {
                    this.logger('debug', {
                        msg: `Disabling mapping for OpenVSLAM`,
                    });
                    system.disableMapping();
                }
                resolve();
            }).catch(reject);
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.systems.map(systemUID => this.service.findSystemByUID(systemUID));
            Promise.all(promises).then(systemInstances => {
                systemInstances.forEach(system => {
                    if (this.options.mapDatabaseFile && this.options.mapping && this.options.persistMapping) {
                        // Save mapping
                        this.logger('debug', {
                            msg: `Saving OpenVSLAM map database ...`,
                            file: this.options.mapDatabaseFile
                        });
                        system.saveMap(this.options.mapDatabaseFile);
                    }
                });
                // Delete and shutdown systems
                return Promise.all(this.systems.map(systemUID => this.service.deleteSystem(systemUID)));
            }).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    process(data: In): Promise<Out> {
        return new Promise((resolve, reject) => {
            let uid = undefined;
            this.service.findSystemUIDByObject(data.source).then(systemUID => {
                uid = systemUID;
                return this.service.findSystemByUID(uid);
            }).then(system => {
                if (!system) {
                    return resolve(undefined);
                }

                const out = new VSLAMFrame(data);
                const timestamp = TimeService.getUnit().convert(data.phenomenonTimestamp, TimeUnit.SECOND);
                // Process the frame differently depending on the type of video frame
                if (data instanceof VideoFrame) {
                    out.image = data.image;
                    system.feedMonocularFrame(data.image, timestamp);
                } else if (data instanceof StereoVideoFrame) {
                    out.image = data.left.image;
                    system.feedStereoFrame(data.left.image, data.right.image, timestamp);
                } else if (data instanceof DepthImageFrame) {
                    out.image = data.image;
                    system.feedRGBDFrame(data.image, data.depth, timestamp);
                }
            
                // Fetch the current camera pose
                const pose = new Matrix4().fromArray(system.getMapPublisher().getCurrentCamPose());
                out.cameraPose = pose;
                out.systemUID = uid;
                resolve(out as Out);
            }).catch(reject);
        });
    }
}

export interface VSLAMProcessingNodeOptions extends ProcessingNodeOptions {
    /**
     * Enable mapping and localization
     */
    mapping?: boolean;
    /**
     * Configuration file
     */
    config: string;
    /**
     * Map database file (MSG) for loading and storage
     */
    mapDatabaseFile?: string;
    /**
     * Persist the mapping to the map database file
     */
    persistMapping?: boolean;
}

