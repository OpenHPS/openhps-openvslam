import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { StereoVideoFrame, VideoFrame } from '@openhps/opencv';
import openvslam from '../../openvslam';

export class VSLAMProcessingNode
    <In extends VideoFrame | StereoVideoFrame, 
    Out extends VideoFrame | StereoVideoFrame> extends ProcessingNode<In, Out> {
    protected _config: any;

    constructor(options?: VSLAMProcessingNodeOptions) {
        super(options);

        this.once("build", this._onBuild.bind(this));
    }

    private _onBuild(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._config = new openvslam.Config();
            resolve();
        });
    }
    
    process(data: In): Promise<Out> {
        return new Promise((resolve, reject) => {
            
        });
    }

}

export interface VSLAMProcessingNodeOptions extends ProcessingNodeOptions {
    
}
