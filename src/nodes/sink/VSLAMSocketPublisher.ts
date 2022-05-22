import { PushOptions, SinkNode, SinkNodeOptions } from '@openhps/core';
import { VSLAMFrame } from '../../data';
import { SocketPublisher } from '../../openvslam';
import { VSLAMService } from '../../service/VSLAMService';

export class VSLAMSocketPublisher<In extends VSLAMFrame> extends SinkNode<In> {
    protected options: VSLAMSocketViewerOptions;
    protected service: VSLAMService;
    protected publishers: Map<string, SocketPublisher> = new Map();

    constructor(options?: VSLAMSocketViewerOptions) {
        super(options);
        this.options.url = this.options.url ?? 'http://localhost:3000';

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.model) {
                return reject(new Error(`Unable to start VSLAM processing without VSLAMService!`));
            }
            this.service = this.model.findService(VSLAMService);
            resolve();
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve) => {
            this.publishers.forEach(publisher => {
                publisher.terminate();
            });
            resolve();
        });
    }

    onPush(frame: In, options?: PushOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (frame.systemUID) {
                const publisher = this.publishers.get(frame.systemUID);
                if (publisher === undefined) {
                    this.service.findSystemByUID(frame.systemUID).then(system => {
                        const publisher = new SocketPublisher(system, this.options.url);
                        publisher.run();
                        this.publishers.set(frame.systemUID, publisher);
                    }).catch(reject);
                }
            }
            resolve();
        });
    }
}

export interface VSLAMSocketViewerOptions extends SinkNodeOptions {
    url: string;
}
