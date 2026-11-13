import { PushOptions, SinkNode, SinkNodeOptions } from '@openhps/core';
import { VSLAMFrame } from '../../data';
import { PangolinViewer } from '../../openvslam';
import { VSLAMService } from '../../service/VSLAMService';

export class VSLAMPangolinViewer<In extends VSLAMFrame> extends SinkNode<In> {
    protected options: VSLAMPangolinViewerOptions;
    protected service: VSLAMService;
    protected viewers: Map<string, PangolinViewer> = new Map();

    constructor(options?: VSLAMPangolinViewerOptions) {
        super(options);
        this.options = options ?? {};

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.model) {
                return reject(new Error(`Unable to start VSLAM processing without VSLAMService!`));
            }
            this.service = this.model.findService(VSLAMService);
            if (!this.service) {
                return reject(new Error(`Unable to start VSLAM Pangolin viewer without VSLAMService!`));
            }
            resolve();
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve) => {
            this.viewers.forEach((viewer) => {
                viewer.terminate();
            });
            resolve();
        });
    }

    onPush(frame: In, options?: PushOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!frame.systemUID) {
                return resolve();
            }
            const existingViewer = this.viewers.get(frame.systemUID);
            if (existingViewer) {
                return resolve();
            }
            this.service
                .findSystemByUID(frame.systemUID)
                .then((system) => {
                    if (!system) {
                        return reject(new Error(`VSLAM system ${frame.systemUID} not found!`));
                    }
                    // A viewer may have been created by a concurrent push
                    if (this.viewers.has(frame.systemUID)) {
                        return;
                    }
                    const viewer = new PangolinViewer(system, '');
                    viewer.run();
                    this.viewers.set(frame.systemUID, viewer);
                })
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }
}

export interface VSLAMPangolinViewerOptions extends SinkNodeOptions {}
